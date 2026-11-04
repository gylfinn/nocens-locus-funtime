"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { ArrowRight, Check, Download, Plus, ScrollText, X } from "lucide-react";
import { reencryptGuideFile } from "@/lib/funtime-crypto";

const BATTLETAG_RE = /^.+#\d+$/;
const DEST_TAGS_KEY = "funtime-dest-tags";

type SavedTag = { tag: string; on: boolean };

// Saved friends live in this browser's localStorage.
const tagListeners = new Set<() => void>();
function subscribeTags(cb: () => void) {
  tagListeners.add(cb);
  return () => void tagListeners.delete(cb);
}
function saveTags(tags: SavedTag[]) {
  localStorage.setItem(DEST_TAGS_KEY, JSON.stringify(tags));
  tagListeners.forEach((l) => l());
}
function parseTags(raw: string | null): SavedTag[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    // The first version stored plain text, one tag per line.
    const lines = raw.split("\n").map((t) => t.trim()).filter((t) => BATTLETAG_RE.test(t));
    return lines
      .filter((t, i) => lines.findIndex((u) => u.toLowerCase() === t.toLowerCase()) === i)
      .map((tag) => ({ tag, on: true }));
  }
}

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/** "<guide>!<BattleTag>.txt", optionally with a browser " (N)" before .txt. */
function parseFileName(name: string) {
  const tag = name.match(/!([^(]+?)\s*(?:\(\d+\))?\.txt$/i)?.[1].trim() ?? "";
  const guide = name.replace(/\s*(?:\(\d+\))?\.txt$/i, "").replace(/![^!]*$/, "").trim();
  return { guide: guide || name, tag };
}

/** Throws when the file can't be decrypted as `tag`; re-encrypting for the same tag only verifies. */
const verify = (raw: string, tag: string) => reencryptGuideFile(raw, tag, tag).guideCount;

/** The size Windows Explorer shows (KiB, rounded up). */
const sizeLabel = (bytes: number) => `${Math.max(1, Math.ceil(bytes / 1024)).toLocaleString("en")} KB`;

/** "Sóni#2342" → ["Sóni", "#2342"], so the number can sit quieter than the name. */
function splitTag(tag: string): [string, string] {
  const i = tag.lastIndexOf("#");
  return i > 0 ? [tag.slice(0, i), tag.slice(i)] : [tag, ""];
}

/** Each load gets an id, so the rebind plays once per guide that arrives verified. */
type Loaded = { id: number; guide: string; raw: string; size: number; tag: string; arrivedVerified: boolean };
type SourceCheck =
  | { ok: true; guideCount: number }
  | { ok: false; reason: "missing" | "format" | "wrong" | "not-a-guide" };

/** The item's icon well: a square slot edged in the item's quality colour. */
function IconWell({ quality, empty }: { quality: "epic" | "poor"; empty?: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid size-14 shrink-0 place-items-center rounded-[4px] bg-[#11131c] transition-colors duration-300 ${
        empty ? "border border-dashed border-[#4a4f5f] text-poor" : quality === "epic" ? "border border-epic text-epic" : "border border-poor text-poor"
      }`}
    >
      <ScrollText className="size-7" strokeWidth={1.5} />
    </span>
  );
}

/** "Binds to" target: shows the original's tag, then wipes it over to the friend's (CSS, once per mount). */
function RebindTag({ from, to }: { from?: string; to: string }) {
  return (
    <span className="rebind">
      {from && (
        <span className="rebind-from" aria-hidden>
          {from}
        </span>
      )}
      <span className="rebind-to">{to}</span>
    </span>
  );
}

export function FuntimeCard() {
  const tagsRaw = useSyncExternalStore(subscribeTags, () => localStorage.getItem(DEST_TAGS_KEY), () => null);
  const friends = useMemo(() => parseTags(tagsRaw), [tagsRaw]);

  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [sourceTag, setSourceTag] = useState("");
  const [editingSource, setEditingSource] = useState(false);
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());
  const [newTag, setNewTag] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [removed, setRemoved] = useState<{ item: SavedTag; index: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // The source is checked as soon as there is one: decrypting it proves the copies will open.
  const check = useMemo<SourceCheck | null>(() => {
    if (!loaded) return null;
    if (!sourceTag) return { ok: false, reason: "missing" };
    if (!BATTLETAG_RE.test(sourceTag)) return { ok: false, reason: "format" };
    try {
      return { ok: true, guideCount: verify(loaded.raw, sourceTag) };
    } catch (e) {
      const notGuide = e instanceof Error && e.message.startsWith("No encrypted guide data");
      return { ok: false, reason: notGuide ? "not-a-guide" : "wrong" };
    }
  }, [loaded, sourceTag]);

  const ok = check?.ok === true;
  const isSource = (tag: string) => !!loaded && same(tag, sourceTag);
  const ready = ok ? friends.filter((f) => f.on && !isSource(f.tag)).map((f) => f.tag) : [];

  const loadFile = useCallback(async (f: File) => {
    const { guide, tag } = parseFileName(f.name);
    const raw = await f.text();
    let arrivedVerified = false;
    if (BATTLETAG_RE.test(tag)) {
      try {
        verify(raw, tag);
        arrivedVerified = true;
      } catch {
        // The filename's tag doesn't open it; the source field takes over.
      }
    }
    setLoaded((prev) => ({ id: (prev?.id ?? 0) + 1, guide, raw, size: f.size, tag, arrivedVerified }));
    setSourceTag(tag);
    setEditingSource(!tag);
    setDownloaded(new Set());
  }, []);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = ""; // picking the same file again still loads it
    if (f) loadFile(f);
  };

  async function download(tags: string[]) {
    if (!loaded || !ok) return;
    for (const [i, tag] of tags.entries()) {
      // ponytail: fixed gap, since browsers can drop downloads fired back to back. Zip them if this proves flaky.
      if (i) await new Promise((r) => setTimeout(r, 300));
      const { output } = reencryptGuideFile(loaded.raw, sourceTag, tag);
      const url = URL.createObjectURL(new Blob([output], { type: "text/plain" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${loaded.guide}!${tag}.txt`; // the name the source tag is read back from
      a.click();
      URL.revokeObjectURL(url);
      setDownloaded((d) => new Set(d).add(tag.toLowerCase()));
    }
  }

  function addFriend(e: React.FormEvent) {
    e.preventDefault();
    const tag = newTag.trim();
    if (!BATTLETAG_RE.test(tag)) {
      setAddError(`“${tag}” isn't a BattleTag. Use the Name#1234 form.`);
      return;
    }
    saveTags(
      friends.some((f) => same(f.tag, tag))
        ? friends.map((f) => (same(f.tag, tag) ? { ...f, on: true } : f))
        : [...friends, { tag, on: true }],
    );
    setNewTag("");
    setAddError(null);
    setRemoved(null);
  }

  const toggle = (i: number) => saveTags(friends.map((f, j) => (j === i ? { ...f, on: !f.on } : f)));
  function remove(i: number) {
    setRemoved({ item: friends[i], index: i });
    saveTags(friends.filter((_, j) => j !== i));
  }
  function undoRemove() {
    if (!removed) return;
    const next = [...friends];
    next.splice(Math.min(removed.index, next.length), 0, removed.item);
    saveTags(next);
    setRemoved(null);
  }

  const showSourceField = !!loaded && (editingSource || (check?.ok === false && check.reason !== "not-a-guide"));
  // The rebind plays only for a guide that opened with its filename's tag the moment it landed.
  // It depends on the arrival, not the current source, so fixing or breaking the source never replays it.
  const rebindFrom = loaded?.arrivedVerified ? loaded.tag : undefined;

  return (
    <main className="mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-10 lg:px-20 lg:py-14">
      <header className="mb-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h1 className="text-[22px] font-bold leading-none tracking-[0.005em]">Nocens Locus Funtime</h1>
        <p className="text-base text-poor">Drop a guide to rebind it for your friends.</p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,470px)_auto_minmax(0,1fr)] lg:gap-7">
        {/* The original */}
        <section
          aria-label="Original guide"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) loadFile(f);
          }}
          className={`rounded-[7px] ${dragOver ? "outline-2 outline-offset-4 outline-dashed outline-gold" : ""}`}
        >
          {!loaded ? (
            <label className="slot focus-within-ring flex cursor-pointer items-start gap-4 px-6 py-5 text-lg leading-snug transition-[border-color] hover:border-edge">
              <input type="file" accept=".txt,text/plain" className="sr-only" onChange={onPick} />
              <IconWell quality="poor" empty />
              <span className="min-w-0">
                <span className="block text-[30px] font-semibold leading-tight text-poor">No guide yet</span>
                <span className="block">Binds to —</span>
                <span className="mt-2 block text-pretty text-poor">Drop a guide export here, or choose its .txt file.</span>
              </span>
            </label>
          ) : (
            <div className="tip px-6 py-5 text-lg leading-snug">
              <div className="flex items-start gap-4">
                <IconWell quality={ok ? "epic" : "poor"} />
                <p
                  className={`min-w-0 text-[30px] font-semibold leading-tight [overflow-wrap:anywhere] transition-colors duration-300 ${ok ? "text-epic" : "text-poor"}`}
                >
                  {loaded.guide}
                </p>
              </div>

              <div className="mt-3">
                {showSourceField ? (
                  <form
                    className="flex flex-wrap items-center gap-x-3 gap-y-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (ok) setEditingSource(false);
                    }}
                  >
                    <label htmlFor="source-tag">Binds to</label>
                    <input
                      id="source-tag"
                      value={sourceTag}
                      onChange={(e) => setSourceTag(e.target.value.trim())}
                      placeholder="Name#1234"
                      autoComplete="off"
                      spellCheck={false}
                      aria-invalid={check?.ok === false}
                      aria-describedby="source-status"
                      className="h-10 w-56 rounded-[4px] border border-[#3a3f4e] bg-[#11131c] px-3 text-lg placeholder:text-poor focus:border-gold focus:outline-none"
                    />
                    {ok && (
                      <button type="submit" className="btn-quiet">
                        Done
                      </button>
                    )}
                  </form>
                ) : (
                  <p className="flex flex-wrap items-baseline gap-x-3">
                    <span>Binds to {sourceTag}</span>
                    <button type="button" className="link-quiet text-base" onClick={() => setEditingSource(true)}>
                      change
                    </button>
                  </p>
                )}

                {check?.ok && (
                  <p className="flex justify-between gap-4">
                    <span>Guide export</span>
                    <span>{check.guideCount.toLocaleString("en")} guides</span>
                  </p>
                )}
                <p className="flex justify-between gap-4">
                  <span>Size</span>
                  <span>{sizeLabel(loaded.size)}</span>
                </p>

                <p id="source-status" aria-live="polite" className={`mt-2 text-pretty ${ok ? "text-uncommon" : "text-req"}`}>
                  {ok && "Use: Make a copy bound to each friend."}
                  {check?.ok === false && check.reason === "missing" && "Who is this bound to? Its BattleTag wasn't in the file name."}
                  {check?.ok === false && check.reason === "format" && "A BattleTag looks like Name#1234."}
                  {check?.ok === false && check.reason === "wrong" && `Can't be opened as ${sourceTag}. Check who it's bound to.`}
                  {check?.ok === false && check.reason === "not-a-guide" && "This file isn't a guide export."}
                </p>
                <p className="mt-2 italic text-poor">“Made for one. Copied for the whole party.”</p>

                <label className="link-quiet focus-within-ring mt-4 inline-block text-base">
                  <input type="file" accept=".txt,text/plain" className="sr-only" onChange={onPick} />
                  Choose another file
                </label>
              </div>
            </div>
          )}
        </section>

        <ArrowRight aria-hidden className="mt-24 hidden size-9 text-edge lg:block" strokeWidth={1.5} />

        {/* The copies: one per friend, the friend first */}
        <section aria-labelledby="copies-heading" className="min-w-0">
          <h2 id="copies-heading" className="mb-3 text-lg font-semibold text-poor">
            Copies
          </h2>

          {friends.length === 0 && (
            <p className="mb-3 text-base text-poor">Add the BattleTags of the friends you make copies for.</p>
          )}

          <ul className="flex flex-col gap-3.5">
            {friends.map((f, i) => {
              const original = isSource(f.tag);
              const included = f.on && !original;
              const live = ok && included;
              const done = downloaded.has(f.tag.toLowerCase());
              const [name, number] = splitTag(f.tag);
              // While the rebind plays, Ready and Download wait for the swap to land.
              const reveal = live && rebindFrom ? "rebind-reveal" : "";
              const status = original
                ? "This is the original"
                : !f.on
                  ? "Left out"
                  : live
                    ? done
                      ? "Downloaded"
                      : "Ready"
                    : loaded
                      ? "Waiting for the original"
                      : "Gets a copy";
              return (
                <li
                  key={f.tag}
                  style={{ "--rebind-delay": `${i * 70}ms` } as React.CSSProperties}
                  className={`tip grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-3 py-4 pl-4 pr-14 sm:grid-cols-[auto_minmax(0,1fr)_8.5rem] sm:items-center ${included ? "" : "text-poor"}`}
                >
                  {/* The original gets no checkbox: it can't be a copy of itself. The spacer keeps the column. */}
                  {original ? (
                    <span aria-hidden className="size-[1.375rem]" />
                  ) : (
                    <input
                      id={`include-${i}`}
                      type="checkbox"
                      className="check mt-1 sm:mt-0 sm:self-start sm:translate-y-1"
                      checked={included}
                      onChange={() => toggle(i)}
                      aria-label={`Make a copy for ${f.tag}`}
                    />
                  )}
                  <div className="min-w-0 leading-snug">
                    <label
                      htmlFor={original ? undefined : `include-${i}`}
                      className={`block text-[22px] font-semibold [overflow-wrap:anywhere] ${original ? "" : "cursor-pointer"} ${included ? "text-ink" : ""}`}
                    >
                      {name}
                      <span className="font-normal text-poor">{number}</span>
                    </label>
                    <p
                      key={loaded?.id ?? 0}
                      className={`text-lg [overflow-wrap:anywhere] ${live ? "text-epic" : "text-poor"} ${included && rebindFrom ? "rebind-quality" : ""}`}
                    >
                      {loaded ? loaded.guide : "No guide yet"}
                    </p>
                    {loaded ? (
                      <p className="flex flex-wrap justify-between gap-x-4 text-lg">
                        <span className="[overflow-wrap:anywhere]">
                          Binds to <RebindTag key={loaded.id} from={included ? rebindFrom : undefined} to={f.tag} />
                        </span>
                        <span key={loaded.id} className={`ml-auto text-right ${live ? "text-uncommon" : ""} ${reveal}`}>
                          {status}
                        </span>
                      </p>
                    ) : (
                      <p className="text-lg">{status}</p>
                    )}
                  </div>

                  {live && (
                    <button
                      key={loaded?.id}
                      type="button"
                      className={`btn-gold col-start-2 justify-self-start sm:col-start-auto sm:justify-self-end ${reveal}`}
                      onClick={() => download([f.tag])}
                    >
                      {done ? <Check aria-hidden className="size-4" /> : <Download aria-hidden className="size-4" />}
                      Download
                    </button>
                  )}

                  <button
                    type="button"
                    aria-label={`Remove ${f.tag}`}
                    onClick={() => remove(i)}
                    className="absolute right-2 top-2 grid size-10 cursor-pointer place-items-center rounded-[4px] text-poor transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <X aria-hidden className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>

          {removed && (
            <p aria-live="polite" className="mt-3 text-base text-poor">
              Removed {removed.item.tag}.{" "}
              <button type="button" className="link-quiet" onClick={undoRemove}>
                Undo
              </button>
            </p>
          )}

          <form onSubmit={addFriend} className="slot mt-3.5 flex items-center gap-3 py-2 pl-4 pr-2">
            <Plus aria-hidden className="size-5 shrink-0 text-poor" />
            <input
              value={newTag}
              onChange={(e) => {
                setNewTag(e.target.value);
                setAddError(null);
              }}
              aria-label="Friend's BattleTag"
              aria-invalid={!!addError}
              aria-describedby={addError ? "add-error" : undefined}
              placeholder="Add a friend, e.g. Name#1234"
              autoComplete="off"
              spellCheck={false}
              className="h-10 min-w-0 flex-1 bg-transparent text-base placeholder:text-poor focus:outline-none sm:text-lg"
            />
            <button type="submit" className="btn-quiet" disabled={!newTag.trim()}>
              Add
            </button>
          </form>
          {addError && (
            <p id="add-error" role="alert" className="mt-2 text-pretty text-base text-req">
              {addError}
            </p>
          )}

          {ready.length >= 2 && (
            <div className="mt-6 flex justify-end">
              <button type="button" className="btn-gold h-12 px-6 text-lg" onClick={() => download(ready)}>
                <Download aria-hidden className="size-5" />
                {ready.length === 2 ? "Download both" : `Download all ${ready.length}`}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
