---
name: Nocens Locus Funtime
description: One guide export, rebound as a copy for each friend's BattleTag, drawn as item tooltips.
colors:
  void: "#05060a"
  tip: "#0a0b12"
  edge: "#5b6175"
  ink: "#ffffff"
  poor: "#9d9d9d"
  epic: "#b25bff"
  uncommon: "#1eff00"
  gold: "#ffd100"
  req: "#ff4040"
  bronze: "#3a2f0c"
  bronze-deep: "#241d07"
  bronze-edge: "#8a7432"
  well: "#11131c"
  rule: "#3a3f4e"
  slot-edge: "#4a4f5f"
typography:
  display:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.25
    fontFeature: "\"tnum\""
  headline:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.005em"
    fontFeature: "\"tnum\""
  title:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.375
    fontFeature: "\"tnum\""
  body:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.375
    fontFeature: "\"tnum\""
  label:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "\"tnum\""
rounded:
  check: "3px"
  control: "4px"
  frame: "6px"
spacing:
  row-gap: "14px"
  row-pad: "16px"
  frame-pad-y: "20px"
  frame-pad-x: "24px"
  column-gap: "28px"
  header-gap: "40px"
components:
  tooltip:
    backgroundColor: "rgb(8 9 16 / 0.94)"
    textColor: "{colors.ink}"
    rounded: "{rounded.frame}"
    padding: "20px 24px"
  slot:
    backgroundColor: "rgb(8 9 16 / 0.6)"
    textColor: "{colors.ink}"
    rounded: "{rounded.frame}"
    padding: "20px 24px"
  button-gold:
    backgroundColor: "{colors.bronze}"
    textColor: "{colors.gold}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "2.5rem"
  button-gold-large:
    backgroundColor: "{colors.bronze}"
    textColor: "{colors.gold}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "3rem"
  button-quiet:
    backgroundColor: "{colors.well}"
    textColor: "#d6d8de"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "2.5rem"
  button-quiet-hover:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
  input-field:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "2.5rem"
  check:
    backgroundColor: "{colors.well}"
    rounded: "{rounded.check}"
    size: "1.375rem"
  icon-well:
    backgroundColor: "{colors.well}"
    rounded: "{rounded.control}"
    size: "3.5rem"
---

# Design System: Nocens Locus Funtime

## Overview

**Creative North Star: "The Item Tooltip"**

Every surface is an item tooltip from the game the owner plays next to this page. The guide is an item; each friend's copy is the same item rebound to someone else. Containers are tooltip panels (near-black, a 1px cool-grey edge, a black outer hairline, small corners) or, where something is still to come, empty item slots (the same frame, dashed and quieter). Text colours are the tooltip's own: the item's name in epic purple, stat lines in white, the "Use:" line and Ready in uncommon green, left-out things in poor-quality grey, unmet requirements in red, and actions in tooltip gold on dark bronze buttons.

Density is a tooltip's: short lines, label left and value right, no decoration between rows. The one face is Barlow at four sizes, with tabular figures everywhere so tags, counts and sizes line up. Depth comes from a dark drop shadow under the panel and the black hairline around it; nothing glows.

The world's signature is the rebind: when a verified guide lands, each copy's "Binds to" line wipes from the original's tag to the friend's, row by row, while the item name lifts from poor grey to epic.

**Key Characteristics:**
- Tooltip panels and dashed item slots are the only containers.
- Colour is meaning: each hue is an item-quality or tooltip-line colour, never decoration.
- One face (Barlow), four sizes (30, 22, 18, 16px), tabular figures throughout.
- Gold on bronze marks an action; gold also draws the focus ring.
- A dark radial ground under everything; no glow, no colour on the shadow.

## Colors

A near-black tooltip palette where every hue is borrowed from item quality and tooltip lines, and is used only for that meaning.

### Primary
- **Epic Purple** (epic): the item's name. The guide name on the original and on each live copy, and the icon well's edge, once the source has verified. Lifted from the game's epic for contrast on the dark panel.
- **Tooltip Gold** (gold): actions. The text of every gold button, the checked checkmark, the caret, the drag-over outline and the focus ring.

### Secondary
- **Uncommon Green** (uncommon): the reserved colour. Only the "Use:" line on the original and the Ready / Downloaded status on a live copy.

### Tertiary
- **Requirement Red** (req): unmet requirements, which here means errors: a wrong or missing source tag, a malformed BattleTag on add.

### Neutral
- **Void** (void): the page ground and the base of the body's radial gradient (from #171c30 at 28% 32% through #0b0d16).
- **Tooltip Black** (tip): the panel tone; panels render it as a translucent rgb(8 9 16 / 0.94) over the ground.
- **Cool Edge** (edge): the tooltip's 1px edge, the arrow between original and copies, the hover border of slots and quiet buttons.
- **Stat White** (ink): stat lines, friend names, body copy.
- **Poor Grey** (poor): secondary text, the hint, placeholders, quiet links, the BattleTag number, left-out copies, the unverified guide name.
- **Well** (well): the inside of controls: icon wells, inputs, checkboxes, quiet buttons.
- **Rule** (rule): the border of inputs and quiet buttons, and the scrollbar thumb.
- **Slot Edge** (slot-edge): the dashed edge of empty slots and the empty icon well.
- **Bronze, Bronze Deep, Bronze Edge** (bronze, bronze-deep, bronze-edge): the gold button's top-to-bottom fill and its 1px border; the bronze edge also marks a checked checkbox.

### Named Rules
**The Tooltip Meaning Rule.** A colour enters only with the meaning it has in an item tooltip. If a hue has no tooltip meaning, it doesn't ship.

**The One Green Rule.** Uncommon green is for ready and nothing else: the "Use:" line and a copy's Ready / Downloaded status. It is never a success toast, a link or a button.

**The Earned Epic Rule.** A guide name is epic only after its source has verified. Unverified, waiting or left out, it is poor grey. The colour change is the proof.

## Typography

**Display Font:** Barlow (with ui-sans-serif, system-ui, sans-serif), loaded through next/font at 400, 500, 600, 700.

**Character:** One condensed-leaning grotesque in a few weights, like a game UI's single face. Hierarchy comes from size and colour, not from a second family.

### Hierarchy
- **Display** (600, 30px, 1.25): the guide name on the original tooltip, or "No guide yet" in the empty slot. Wraps anywhere.
- **Headline** (700, 22px, 1, 0.005em): the product name, once, top left.
- **Title** (600, 22px, 1.375): a friend's name on a copy; the "#digits" part drops to 400 in poor grey.
- **Body** (400, 18px, 1.375): stat lines (Binds to, Guide export, Size), status, the "Use:" line, the flavour line, the "Copies" heading at 600 in poor grey, the large gold button.
- **Label** (400, 16px): the hint top right, quiet links ("change", "Choose another file", "Undo"), the empty-list prompt, error under the add field, the add input on mobile.

### Named Rules
**The Four Sizes Rule.** Barlow at 30, 22, 18 and 16px, nothing else. A new element takes one of these sizes.

**The Tabular Rule.** Figures are tabular everywhere (set on body), so tags, guide counts and sizes align down a column.

## Layout

One screen. A centred column up to 1320px wide, padded 20px on mobile, 40px from 640px and 80px from 1024px, 40px top (56px at 1024px). The header is a baseline-aligned row: the name left, the one-line hint right; on narrow screens the hint wraps under the name.

From 1024px the body is three columns: the original (up to 470px), a 36px arrow in cool edge, then the copies (the rest), 28px apart and top-aligned. Below 1024px they stack, 32px apart, and the arrow is hidden.

Copies are a vertical list 14px apart. Each copy row is a grid: checkbox, text, and from 640px a reserved 8.5rem action column, so the status column ends at one right edge whether or not a Download button is present. Rows pad 16px left and 56px right, leaving room for the remove button in the top-right corner. Below 640px the Download button moves under the text, aligned with it. Inside a tooltip, stat lines run label left and value right. The add-a-friend slot follows the list at the same gap; "Download all" sits right-aligned 24px below.

## Elevation & Depth

Depth is a tooltip's: one dark drop shadow under each panel, plus a black 1px outer hairline that separates the cool edge from the ground. Slots are flat. Nothing uses a coloured shadow or glow, and there is no hover lift.

### Shadow Vocabulary
- **Tooltip drop** (`box-shadow: 0 18px 50px rgb(0 0 0 / 0.6)`, with `outline: 1px solid #000`): every tooltip panel, the original and each copy.

### Named Rules
**The No Glow Rule.** Shadows are black and fall downward. A quality colour never becomes a glow, halo or coloured shadow.

## Shapes

Small, nearly square corners: 6px on panels and slots, 4px on buttons, inputs and the icon well, 3px on the checkbox. Edges are 1px: solid for a present thing, dashed for an empty slot or the drag-over target. The icon well is a 56px square edged in the item's quality colour (epic when verified, poor when not, dashed slot-edge when empty) holding a line-art scroll icon at a 1.5 stroke.

## Components

### Buttons
Gold-on-bronze for the next action, quiet for everything else.
- **Shape:** gently squared (4px), 40px tall.
- **Gold:** gold text, 600, on a bronze-to-bronze-deep vertical gradient with a bronze-edge border, 18px side padding, an optional 16px icon. Hover lightens the fill (#4a3c10 to #2e250a) and the border (#c9a640); press nudges it down 1px. The large variant ("Download both / all N") is 48px tall, 24px padding, body size, 20px icon.
- **Quiet:** #d6d8de text, 500, on well with a rule border, 14px padding. Hover moves the border to cool edge and the text to white. Disabled is 45% opacity.
- **Quiet link:** poor grey, underlined at 3px offset, white on hover.
- **Remove:** a 40px square icon button in the copy's top-right corner, poor grey, white on a 5% white wash on hover.

### Cards / Containers
- **Tooltip:** translucent tooltip black (94%), 1px cool edge, black outer hairline, the tooltip drop, 6px corners. The original pads 20px by 24px; a copy row pads 16px.
- **Slot:** 60% tooltip black, 1px dashed slot-edge, 6px corners, no shadow. Used for the empty original (drop or choose a file) and the add-a-friend row. Hover moves the edge to cool edge.

### Inputs / Fields
- **Style:** well fill, rule border, 4px corners, 40px tall, body size, gold caret, poor-grey placeholder.
- **Focus:** the border turns gold and the global 2px gold focus ring draws outside it.
- **Inside a slot:** the add-a-friend input is borderless and transparent; the slot is its frame.
- **Error:** requirement-red text below or beside the field, announced politely.

### Checkbox
A 22px square in the tooltip's frame: well fill, cool-edge border, 3px corners. Hover lifts the border to #8a90a3; checked takes a bronze-edge border and a gold 3-stroke checkmark; disabled is 40% opacity. The original's row gets an empty spacer instead, since it can't be a copy of itself.

### Copy Row (signature)
A tooltip per friend: name (title) with its number in poor grey, the guide name (epic when live, poor otherwise), then "Binds to <tag>" with the status at the row's right edge, and Download in the reserved column when the copy is live. A left-out or original row turns its whole text poor grey.

**The rebind.** For a guide whose filename tag verified the moment it arrived, each included copy's "Binds to" first shows the original's tag in poor grey, then a clip-path wipe (320ms out, 420ms in, cubic-bezier(0.16, 1, 0.3, 1)) swaps it to the friend's tag. It starts at 260ms plus 70ms per row, and the guide name lifts from poor grey to epic in the same beat (520ms ease-out). Status and Download stay hidden (visibility, so not clickable) until 620ms plus the row delay, then fade in over 240ms. It plays once per arrival: a later change to the source tag never replays it; ticking a friend in plays it for that copy. With reduced motion there is no animation and the final state shows at once.

### Focus
A 2px gold outline at 2px offset on every focusable element. Labels that wrap a visually hidden file input (the empty slot, "Choose another file") show the ring at 3px offset when the input inside has keyboard focus.

## Do's and Don'ts

### Do:
- **Do** build every container as a tooltip (solid cool edge, black hairline, drop shadow) or a slot (dashed, flat), with 6px corners.
- **Do** give each colour its tooltip meaning: epic for a verified item name, white for stat lines, green for ready, gold on bronze for actions, poor grey for left out and secondary, red for errors.
- **Do** set text in Barlow at 30, 22, 18 or 16px with tabular figures.
- **Do** lay stat lines out label left, value right, and keep a copy row's status ending at the same right edge in every state.
- **Do** let the rebind wipe carry the proof that a copy is rebound, and show the final state at once under reduced motion.
- **Do** draw focus as the 2px gold ring, including on labels that wrap hidden inputs.

### Don't:
- **Don't** use uncommon green for anything but the "Use:" line and Ready / Downloaded.
- **Don't** show a guide name in epic before its source has verified.
- **Don't** give a shadow, border or text a coloured glow.
- **Don't** add a second typeface or a fifth text size.
- **Don't** add a hue that has no meaning in an item tooltip.
