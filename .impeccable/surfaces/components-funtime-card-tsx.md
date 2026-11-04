---
version: 1
slug: "components-funtime-card-tsx"
primary_target: "components/funtime-card.tsx"
related_targets: ["app/page.tsx"]
---

## Scope and mode
The whole app: one screen (app/page.tsx renders components/funtime-card.tsx). Mode: Operate. Desktop first; it must still work at 390 px.

## Audience and task
The owner drops their own guide export and takes one copy per ticked friend; friends rarely open it and are briefed in person. Proof is the product itself: the "Binds to" line changing per friend, and the source check before any copy.

## Direction contract
THESIS: Each copy is the guide item rebound to a friend. It refuses the form in a card (drop box, stacked inputs, gold call-to-action).
OWN-WORLD: Item tooltips. Near-black panels with a 1 px cool-grey edge and a black outer hairline, small corners. Item names in epic purple, stat lines white, "Use:" and Ready in uncommon green, actions in tooltip gold on dark bronze buttons, left-out copies in poor-quality grey, errors in requirement red. One face (Barlow) at four sizes with tabular figures. No glow.
STORY: The owner sees the guide as an item bound to them, and beside it a copy rebound to each friend. They take the copies; a returning owner drops the file and downloads.
FIRST VIEWPORT: The name once, top left, with a one-line hint top right. Left: the original's large tooltip, or an empty dashed item slot to drop or choose a file. Right: the "Copies" heading over one tooltip per friend ("Binds to <tag>", status, Download or Include), an add-a-friend slot, then "Download all".
FORM: Item Tooltip, rank 1 of 7 on my list (picked over the rolled rank 7); seed key c69caaa6.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Signature interaction: when a guide lands, each copy rebinds, its "Binds to" line ticking from the source to the friend in a short stagger. With reduced motion it updates without movement.
Disciplines kept from declined challengers: one face at fixed sizes; copies are ready the moment the file lands; one reserved colour (green) for ready; only the next decision is loud.
Critique reference: .impeccable/mocks/decision/model-pick.png (code-led; it is not an approved comp).

## Unresolved
GitHub Pages hosting (static export, basePath, private repo plan) is not decided.
