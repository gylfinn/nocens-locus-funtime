# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The owner: a WoW player whose guide export is locked to their own BattleTag. They make a copy for each friend's BattleTag and send each friend their file themselves (for example on Discord). Now and then a friend may open the page, but the owner explains it to them beforehand, so the page does not have to teach itself.

## Product Purpose

Turn one guide export (a `.txt` locked to one BattleTag) into a copy for each friend's BattleTag, locally in the browser. Success: the owner drops the file and the friends' copies are ready without retyping anything, and each copy opens for the friend it was made for.

## Positioning

It re-locks the same data for another BattleTag: only the encryption layer changes, so every copy keeps the original's data, header and size exactly. The saved friend list and the `<guide>!<BattleTag>.txt` naming round trip make a repeat run a single drop.

## Operating Context

- Used on a desktop computer, next to the game. Planned hosting is a static site, probably GitHub Pages. Desktop is the priority.
- Input: a `.txt` export named `<guide>!<BattleTag>.txt` (a browser may append ` (N)` to the name). The source BattleTag is read from the filename and can be typed instead.
- Output: one `<guide>!<BattleTag>.txt` per selected friend. The owner downloads each copy and sends it to that friend outside the app.
- Repeat use: the same few friends each time. The list is saved in this browser's localStorage (key `funtime-dest-tags`, JSON `[{ "tag", "on" }]`; the earlier plain-text format is migrated).

## Capabilities and Constraints

- All processing happens in the browser; nothing is uploaded. The app must stay compatible with a static export (no server routes, API calls or server actions).
- The source BattleTag is verified by decrypting (zlib header and Adler-32 check) before any copy is made. A wrong tag gives an error and no files.
- The source BattleTag is never a destination. Tags compare case-insensitively; the accepted format is `Name#digits`.
- Open decision: GitHub Pages for a private repository needs a paid plan or a public repository, and a project site needs a `basePath`.

## Brand Commitments

- The name is "Nocens Locus Funtime", shown once as the title. Actions and messages use plain verbs (make copies, download), not the name as a verb.
- Never name the addon anywhere on the page, including help text. Describe the input generically, as a guide export or `.txt`.

## Product Principles

1. One drop, done: after dropping a file, a returning owner reaches their friends' copies in one action.
2. Never hand out a broken copy: verify before output, and what the screen shows always matches the files it will give.
3. The friends are the point: the list of people is the main object, not the form.
4. Quiet about what it is: no addon names, and no explanations the owner gives in person.

## Accessibility & Inclusion

WCAG AA contrast and full keyboard operation. The 2026-11-04 critique found a drop zone that can't be reached by keyboard and text at 2.4:1, so both are known gaps.
