---
target: the Nocens Locus Funtime card (components/funtime-card.tsx)
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
target_identity: "file:C:\\Users\\gylfi\\Documents\\nocens-locus-funtime\\components\\funtime-card.tsx"
target_fingerprint: "sha256:45c8960b3961ca440cd2f8964e1f7c47dddfcaa4a700a12907df9d9e97f77193"
target_path: "C:\\Users\\gylfi\\Documents\\nocens-locus-funtime\\components\\funtime-card.tsx"
timestamp: 2026-11-04T12-02-52Z
slug: components-funtime-card-tsx
---
Method: dual-agent (A: design review · B: detector + browser evidence), headless browsers against localhost:3000.

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | Source tag fills silently; results and "Download 2 files" stay after ticks change |
| 2 | Match System / Real World | 2 | Only verb is the name; Source/Destination for "my tag / my friends" |
| 3 | User Control and Freedom | 3 | × deletes a saved friend instantly, no undo; can't clear the file |
| 4 | Consistency and Standards | 2 | Three format hints; declared fonts aren't rendered |
| 5 | Error Prevention | 3 | Auto-skip and decrypt check strong; Source only validated on run |
| 6 | Recognition Rather Than Recall | 3 | Saved checklist works; only format hint is a 2.4:1 placeholder |
| 7 | Flexibility and Efficiency | 2 | No keyboard path to file picker; N separate downloads |
| 8 | Aesthetic and Minimalist Design | 3 | Clean card; gold on everything, no hierarchy |
| 9 | Error Recovery | 2 | Errors below the buttons at 2.56:1, not at the field |
| 10 | Help and Documentation | 1 | Nothing on which file or what friends do with theirs |
| Total | | 23/40 | Acceptable |

## Design Specificity Verdict
Logic is product-specific (filename round trip, source auto-skip, saved friend list); the look is the stock fantasy-game-tool skin inherited from the stripped landing page. Cinzel and Geist never render: `font-[var(--font-cinzel)]` compiles to font-weight, and --font-geist-sans is set on body while the font stack reads it on html (title renders Segoe UI 400, no web font loads).
Detector: CLI 0 findings (verified it scans .tsx). Browser: 3 findings empty / 6 populated at 1280 and 390: dark-glow and gpt-thin-border-wide-shadow on the card; low-contrast on description, helper, "Click or drop to change"; nested-cards on the tag list (design call) and success alert (false positive). Async body dark-glow is a false positive from the detector's own hidden overlays. Detector understates contrast (ignores 60% alpha: helper is 2.45:1) and misses "All processing happens locally" 2.42, "or click to browse" 2.48, labels 3.5, placeholders 2.40.

## Priority Issues
1. [P0] File drop zone unreachable by keyboard (div onClick, input display:none). Fix: label for an sr-only input + focus ring. /impeccable harden
2. [P1] Trust/guidance text fails contrast (2.4-2.6:1); input border 1.01:1; focus border 2.8:1. Fix: muted #a89a82 (6.4:1), gold labels, 2px gold focus ring. /impeccable audit, /impeccable polish
3. [P1] Primary button label carries no information and outranks Download after success; wraps on mobile. Fix: Download gets gold after success; stack below sm. /impeccable layout
4. [P1] One-file-to-N-copies model invisible; results go stale after ticks change. Fix: live list of files to be made; derive Download from current ticks. /impeccable shape
5. [P2] Fonts in code aren't on screen. Fix: load them correctly or choose new ones in the redesign. /impeccable typeset

## Persona Red Flags
Jordan: description has no readable verb; "guide .txt" doesn't say which file; disabled button with no reason; which tag is me; "869 guides" reads as 869 files; no next step after download.
Sam: drop zone unreachable; no headings; errors not tied to fields; focus drops to body after the primary button.
Casey: "Drop" on a phone; × targets 26px; label wraps; two programmatic downloads 300ms apart.

## Minor Observations
~50px header gap vs 16px elsewhere; white unticked checkbox outshines ticked rows; disabled primary looks broken; long unbroken filename widens mobile page to 536px; "Channeling…"/"champion" never seen; Next dev badge overlaps card on mobile (dev only).

## Questions to Consider
Card as one sentence (from → to)? Run on drop and make Download the only action? Per-friend download buttons instead of "Download N files"?

## Redesign ideas
Any look: from→to model, live results, per-friend downloads, source check on drop, name once.
Directions: Scriptorium (copying desk, paper/ink/vermilion, book serif), Roster (friend list as hero, monograms, per-row download), Pipe (monospace fan-out, neutral + one signal colour).
