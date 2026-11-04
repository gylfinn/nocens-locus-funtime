import pako from "pako";

// --- helpers ---

function base64ToUint8(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// --- core crypto ---

/** Derive 16-byte RC4 key from a BattleTag (uses UTF-8 bytes to match Lua). */
export function deriveKey(battletag: string): Uint8Array {
  const lower = battletag.toLowerCase();
  let bytes = new TextEncoder().encode(lower);

  if (bytes.length > 16) {
    bytes = bytes.slice(bytes.length - 16);
  }

  const k = 16 - bytes.length;
  const buffer = new Uint8Array(16);

  for (let i = 0; i < 16; i++) {
    const j = (i - k) & 0xf;
    if (j < bytes.length) {
      buffer[i] = bytes[j];
    }
  }

  for (let i = 0; i < 16; i++) {
    buffer[(-i) & 0xf] =
      buffer[(15 - i) & 0xf] ^
      buffer[(13 - i) & 0xf] ^
      buffer[(12 - i) & 0xf] ^
      buffer[(10 - i) & 0xf];
  }

  return buffer;
}

/** RC4 Key Scheduling Algorithm. */
export function rc4Ksa(key16: Uint8Array): Uint8Array {
  const S = new Uint8Array(256);
  for (let i = 0; i < 256; i++) S[i] = i;
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key16[i & 0xf]) & 0xff;
    const tmp = S[i];
    S[i] = S[j];
    S[j] = tmp;
  }
  return S;
}

/** RC4 PRGA — symmetric encrypt/decrypt. Copies S-box before use. */
export function rc4Crypt(sBox: Uint8Array, data: Uint8Array): Uint8Array {
  const S = new Uint8Array(sBox);
  let i = 0,
    j = 0;
  const out = new Uint8Array(data.length);
  for (let k = 0; k < data.length; k++) {
    i = (i + 1) & 0xff;
    j = (j + S[i]) & 0xff;
    const tmp = S[i];
    S[i] = S[j];
    S[j] = tmp;
    out[k] = data[k] ^ S[(S[i] + S[j]) & 0xff];
  }
  return out;
}

// --- high-level API ---

/**
 * Nocens Locus Funtime a funtime guide export for another BattleTag.
 * Only the RC4 layer changes: the compressed guide bytes, guide count,
 * checksum and version are kept exactly as the source file has them.
 */
export function reencryptGuideFile(
  raw: string,
  sourceTag: string,
  destTag: string,
): { output: string; guideCount: number } {
  const from = rc4Ksa(deriveKey(sourceTag));
  const to = rc4Ksa(deriveKey(destTag));
  let chunks = 0;

  const output = raw.replace(
    /(-?\d+)(\D)([A-Za-z0-9+/=]+)%/g,
    (chunk, num: string, mode: string, content: string) => {
      if (mode !== ":") return chunk;
      chunks++;
      const compressed = rc4Crypt(from, base64ToUint8(content));
      try {
        pako.inflate(compressed); // a wrong key fails zlib's header and Adler-32 checks
      } catch {
        throw new Error(
          "Could not decrypt this file with the source BattleTag. Check it is the BattleTag the file was made for.",
        );
      }
      return `${num}:${uint8ToBase64(rc4Crypt(to, compressed))}%`;
    },
  );

  if (!chunks) throw new Error("No encrypted guide data found in this file.");
  return { output, guideCount: Number(raw.match(/^(\d+)\|/)?.[1] ?? 0) };
}
