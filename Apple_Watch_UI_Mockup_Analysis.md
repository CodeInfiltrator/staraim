# Apple Watch UI Mockup Analysis (208×248 px, rounded/superellipse corners)

Canvas: 208 × 248 px. Content area roughly x=12..195 (183 wide). Screen corners rounded (~33px radius, iOS-style superellipse smoothing ~exponent 1.5, not circular). Background `#090C0A` throughout.

Source files analyzed (all in `/Users/frizzia/Desktop/All Project/Staraim/.ref/`, ignoring `-1` duplicates): `Home.png`, `Calibration.png`, `Timer Calibration.png`, `Calibration Done.png`, `Choose object.png`, `Object.png`, `Object Details.png`, `No Match.png`, `Object lock timer.png`, `Andromeda.png`, `Button besar.png`, `3D.png`, `Design intent.png`. (Also present: `H1/Project.png`, `H2/Presentation.png` not analyzed.)

## Global Design System

### Palette (from pixel inspection)
| Token | Hex | Notes |
|---|---|---|
| Background | `#090C0A` | Screen bg |
| Panel / Card | `#202821` | Bottom cards, dark UI surfaces (e.g. Object Details card) |
| Dark green (stroke/track) | `#354338` | Progress ring tracks, selection ring base |
| Muted sage | `#748B78` | Inactive arc elements (No Match arcs) |
| Lime primary | `#D5E8B5` | Primary CTA fill (pill buttons), lime ring accents |
| Bright green accent | `#9BE7BA` | Active ring segments/ticks, selection ring (Choose object), lock ring ticks |
| White text | `#F3F1E8` | Primary text/icons |
| Grey secondary | `#A8ADA5` | Secondary text/hints/status elements |
| Jupiter/tan | `#DCBDA1`, `#DFBB82`, `#AD7A60` | Planet tones (banded, warm tan/orange-brown) |

### Common UI Elements
- **Status clock**: `"10:09"` top-right, bbox ~x=167..193, y=14..21. Approx cap-height ~8px, weight regular/medium (grey-ish rendering near `#1D201E` in some contexts but appears white/near-white). Estimated font ~11px.
- **Back button**: Circular, x=12..41, y=13..42 (30×30px). Fill `#202821`. White chevron `‹` (left-pointing). Chevron geometry traced in `Choose object.png`: forms a left-pointing chevron made of white pixels (~`#F3F1E8`/near-white) — visible as a small chevron shape centered in the 30px circle (approximate form: points going left, ~7-8px wide arm).
- **Primary pill button**: Width ~183px (x=12..195), height ~44px, corner radius ~22px (fully pill). Fill `#D5E8B5` (lime), label color `#1A251B` (dark green/near-black on lime). Default vertical position y=182..225 (Calibration Done uses y=145..188).

### Type Scale (derived from cap-heights/x-heights, SF Pro-like)
| Role | Approx cap-height | Approx font size (px) | Weight (inferred) | Notes |
|---|---|---|---|---|
| Display/title "Staraim" (Home) | ~20px | ~28px | Bold/Semibold | Large display |
| Screen titles (e.g. "Point at the Moon", "Two nearby objects", "Explore the sky", "Press to point", "Calibration done") | ~14-16px | ~20-23px | Semibold/Bold | Centered, white `#F3F1E8` |
| Body/subtitle (e.g. "Know what's above.", "Keep the Moon aligned", "Gas giant", "Eastern sky") | ~10-11px | ~14-16px | Regular/Medium | White/near-white |
| Button labels ("Start exploring", "Start calibration", "Finish", "Confirm Jupiter", "Try again") | ~12px | ~16px | Medium/Semibold | On lime pill or other buttons |
| Secondary/hints ("2 seconds left", "Hold steady...", "Move your arm naturally", "Crown to zoom") | ~8-10px | ~11-14px | Regular/Medium | Often grey `#A8ADA5` or white depending on context |
| Status clock "10:09" | ~8px | ~11px | Regular/Medium | Top-right |

---

## Per-Screen Analysis

### Home.png
- **Text (verbatim)**: `"10:09"` (top-right), `"Staraim"` (center upper), `"Know what's above."` (center mid), `"Start exploring"` (button label). 
- **Vertical stacking (top→bottom)**: Status clock (y~14-21) → Title `"Staraim"` (centered) → Subtitle `"Know what's above."` → Primary pill button `"Start exploring"` near bottom.
- **Horizontal alignment**: Centered for title/subtitle/button.
- **Typography**: "Staraim" ~cap 20px / ~28px bold; subtitle ~cap 10-11px / ~14-16px; button label ~cap 12px / ~16px semibold.
- **Colors**: BG `#090C0A`, primary text `#F3F1E8`, button fill `#D5E8B5`, button label `#1A251B`, clock near white.
- **Graphics**: Back button area present (dark circle) but Home likely shows primary entry; no complex planet/ring graphics.
- **Buttons**: Primary pill x=12..195, y~182..225, h=44, r=22, fill `#D5E8B5`, label `"Start exploring"` `#1A251B`.

### Calibration.png
- **Text (verbatim)**: `"10:09"`, `"<"` (back button glyph), `"Point at the Moon"`, `"Keep the Moon aligned"`, `"Start calibration"`.
- **Vertical stacking**: Clock top-right → Back chevron (top-left) → Title `"Point at the Moon"` → Moon graphic (center) → Subtitle `"Keep the Moon aligned"` → Button `"Start calibration"`.
- **Alignment**: Centered.
- **Typography**: Title ~cap 14-16px / ~20-23px semibold; subtitle ~cap 10-11px / ~14-16px; button ~cap 12px / ~16px semibold.
- **Colors**: BG `#090C0A`, text `#F3F1E8`, button `#D5E8B5`/`#1A251B`.
- **Graphics**: **Moon disc** centered. Bbox x~62..144, y~85..168 (⌀~83px). Center approx (103, 126). Radial gradient: peak upper-left ~`#F0F1EA`, transitioning to cooler greige lower-right ~`#6E746D` (limb). Subtle dark mare banding visible. No visible crosshair reticle drawn as heavy lines in this mockup (focus is on alignment instruction).
- **Buttons**: Pill button bottom (y~182..225) `"Start calibration"`.

### Timer Calibration.png
- **Text (verbatim)**: `"10:09"`, `"<"`, `"Aligning."`, `"2 seconds left"`.
- **Vertical stacking**: Clock → Back → `"Aligning."` → Ring+moon graphic center → `"2 seconds left"` below.
- **Alignment**: Centered.
- **Typography**: Title ~cap 14-16px / ~20-23px; hint ~cap 8-10px / ~11-14px `#A8ADA5` or white.
- **Colors**: BG `#090C0A`, text `#F3F1E8`, ring track `#354338`, active tick `#9BE7BA`.
- **Graphics**: **Progress ring + moon**. Outer ring ⌀~112px, bbox x~48..159, y~84..195, center (103.5, 139.5). Ring stroke width ~4px. Track color `#354338`. **Four bright-green arc ticks** at 12/3/6/9 o'clock positions (~±19° segments) in `#9BE7BA`. Inner moon disc ⌀~52px, bbox x~78..129, y~113..164, centered in ring. Moon similar tone to Calibration moon (off-white/greige).
- **Buttons**: None visible as pill; countdown text only.

### Calibration Done.png
- **Text (verbatim)**: `"10:09"`, `"Calibration done"`, `"Finish"`, `"Calibrate again"`.
- **Vertical stacking**: Clock → Title `"Calibration done"` → Checkmark ring graphic → `"Finish"` pill (upper button position) → `"Calibrate again"` pill/text button below.
- **Alignment**: Centered.
- **Typography**: Title ~cap 14-16px / ~20-23px; button labels ~cap 12px / ~16px.
- **Colors**: BG `#090C0A`, text `#F3F1E8`, lime `#D5E8B5`/`#1A251B`, green ring `#D5E8B5`/`#9BE7BA` family.
- **Graphics**: **Lime checkmark ring**. Ring ⌀~52px, bbox x~78..129, y~28..79 (upper area), center approx (103.5, 53.5). Stroke ~5px, lime/green. Checkmark: short arm from ~ (91,52) to (101,65), long arm from (101,65) to (124,42) — clean geometric checkmark.
- **Buttons**: `"Finish"` pill at y~145..188 (higher than default bottom) fill `#D5E8B5`, label `#1A251B`; `"Calibrate again"` appears as secondary action below/nearby (text/button style).

### Choose object.png
- **Text (verbatim)**: `"10:09"`, `"<"`, `"Two nearby objects"`, `"Jupiter • selected"`, `"Confirm Jupiter"`.
- **Vertical stacking**: Clock → Back → Title `"Two nearby objects"` → Two object discs (left/right) → Selection label `"Jupiter • selected"` below/near selected → Confirm button bottom.
- **Alignment**: Centered.
- **Typography**: Title ~cap 14-16px / ~20-23px; selection label ~cap 10-11px / ~14-16px; button ~cap 12px / ~16px.
- **Colors**: BG `#090C0A`, text `#F3F1E8`, panel `#202821`, green accent `#9BE7BA`, tan `#DFBB82`.
- **Graphics**:
  - **Left disc**: Dark disc ⌀~48px, bbox x~34..81, y~78..125. Fill `#202821`. Small white core ~8×8px near center area.
  - **Right disc (selected)**: Dark disc ⌀~58px, bbox x~123..180, y~95..152. Fill `#202821`. **Green selection ring** stroke in `#9BE7BA` (thickness ~2-3px visible as bright green border). Tan core ~9×9px `#DFBB82` (Jupiter-like). Green ring forms a ring around the dark disc.
- **Buttons**: `"Confirm Jupiter"` pill bottom (y~182..225), fill `#D5E8B5`, label `#1A251B`.

### Object.png
- **Text (verbatim)**: `"10:09"`, `"Jupiter"`, `"Planet"`.
- **Vertical stacking**: Clock → Large Jupiter disc (center) → `"Jupiter"` text below disc → `"Planet"` subtitle below.
- **Alignment**: Centered.
- **Typography**: Title `"Jupiter"` ~cap 16-18px / ~23-26px bold; subtitle `"Planet"` ~cap 10-11px / ~14-16px.
- **Colors**: BG `#090C0A`, text `#F3F1E8`, planet tones `#DCBDA1`/`#DBBDA1`/`#CEAC90`/`#AD7A60`/`#A37661`.
- **Graphics**: **Full Jupiter disc** (banded). Large disc centered around x~103, spans roughly y~46..178. Width varies by row (elliptical appearance): at mid-upper ~w~120 at y~74, widens to ~w~134 at y~110, narrows to ~w~92 at y~178. Banded structure visible with alternating tan/orange-brown bands; darker red-brown banding appears (e.g. `#AD7A60` family) forming latitudinal bands. Subtle limb darkening. No strong Great Red Spot as large red oval in this rendering (mostly banded tan/brown).
- **Buttons**: **Bottom-right chevron button** — circular/dark button, bbox x~151..194, y~179..222 (44×44px). Fill `#202821`. Contains white chevron `›` (right-pointing) — traced as right-pointing chevron shape (opposite of back button) in white `#F3F1E8`.

### Object Details.png
- **Text (verbatim)**: `"10:09"`, `"<"`, `"Jupiter"`, `"Gas giant"`, `"Eastern sky"`, `"The largest planet in our"`, `"solar system."`.
- **Vertical stacking**: Clock → Back → `"Jupiter"` title (left/top area) → `"Gas giant"` subtitle → Small Jupiter disc (right/top) → Info card bottom containing `"Eastern sky"` and body text `"The largest planet in our"` / `"solar system."`.
- **Alignment**: Mixed (title left-aligned in that region, body in card).
- **Typography**: Title `"Jupiter"` ~cap 16-18px / ~23-26px; subtitle `"Gas giant"` ~cap 10-11px / ~14-16px; card text `"Eastern sky"` ~cap 10-11px / ~14-16px; body ~cap 9-10px / ~13-14px.
- **Colors**: BG `#090C0A`, text `#F3F1E8`, card fill `#202821`, planet tones same as Object.
- **Graphics**: **Small banded Jupiter disc** on right side, bbox x~123..191, y~59..127 (⌀~69px). Similar banding to full disc. **Dark info card** at bottom: bbox x~12..195, y~139..182 (width ~183px, height ~43px), corner radius ~10px (rounded rect), fill `#202821`. Card contains `"Eastern sky"` and the two-line body text.
- **Buttons**: No primary pill visible; uses card layout.

### No Match.png
- **Text (verbatim)**: `"10:09"`, `"No clear match"`, `"Try again"`.
- **Vertical stacking**: Clock → Graphic center → `"No clear match"` → `"Try again"` pill bottom.
- **Alignment**: Centered.
- **Typography**: Title ~cap 14-16px / ~20-23px; button ~cap 12px / ~16px.
- **Colors**: BG `#090C0A`, text `#F3F1E8`, arcs `#748B78`, center dot `#A8ADA5`, button `#D5E8B5`/`#1A251B`.
- **Graphics**: **Four arc brackets** around a circle. Center (103.5, 101.5), radius ~R≈41.5. Four arcs at N/E/S/W, each spanning ~±30° (arc segments), stroke width ~3px, color `#748B78` (muted sage). **Center dot** is an 8×8 rounded square `#A8ADA5` at center.
- **Buttons**: Pill bottom `"Try again"`, fill `#D5E8B5`, label `#1A251B`.

### Object lock timer.png
- **Text (verbatim)**: `"10:09"`, `"<"`, `"Jupiter"`, `"Hold steady..."`, `"2.1s"`.
- **Vertical stacking**: Clock → Back → `"Jupiter"` title → Graphic center (ring + planet) → `"Hold steady..."` below graphic → `"2.1s"` large text lower/mid.
- **Alignment**: Centered.
- **Typography**: Title `"Jupiter"` ~cap 16-18px / ~23-26px; hint `"Hold steady..."` ~cap 10-11px / ~14-16px; timer `"2.1s"` ~cap 16-18px / ~23-26px (prominent).
- **Colors**: BG `#090C0A`, text `#F3F1E8`, ring track `#354338`, ticks `#9BE7BA`, planet `#DCBDA1` family.
- **Graphics**: **Lock progress ring + Jupiter**. Dark-green ring ⌀~116px, bbox x~46..161, y~93..208, center approx (103.5, 150.5). Track `#354338`, stroke ~4-5px. **Four green tick arcs** in `#9BE7BA` at cardinal positions (similar style to Timer Calibration). **Jupiter disc** inside ring ⌀~80px, bbox x~64..143, y~111..190, banded tan/brown similar to Object but smaller/fitting in ring.
- **Buttons**: No pill button; uses timer text `"2.1s"`.

### Andromeda.png
- **Text (verbatim)**: `"10:09"`, `"<"`, `"Explore the sky"`, `"Orion"`, `"Crown to zoom"`.
- **Vertical stacking**: Clock → Back → `"Explore the sky"` title → Star/constellation graphic center → `"Orion"` label → `"Crown to zoom"` hint below.
- **Alignment**: Centered.
- **Typography**: Title ~cap 14-16px / ~20-23px; label `"Orion"` ~cap 10-11px / ~14-16px; hint ~cap 8-10px / ~11-14px.
- **Colors**: BG `#090C0A`, text `#F3F1E8`/`#A8ADA5`.
- **Graphics**: **Constellation lines + stars**. Thin white/bright lines connecting stars forming a pattern. Stars appear as small bright points/small clusters. Approximate star positions (from component analysis): A(33-38,103-109), B(115-122,94-99), C(76-84,121-127), D(118-129,141-147), E(71-79,167-173), plus far-right star (184-189,117-122). Lines connect these points (constellation-like diagram). Overall looks like a simplified constellation/star map graphic.
- **Buttons**: None visible as pill.

### Button besar.png
- **Text (verbatim)**: `"10:09"`, `"<"`, `"Press to point"`, `"Move your arm naturally"`.
- **Vertical stacking**: Clock → Back → `"Press to point"` title → Large circular button graphic center → `"Move your arm naturally"` hint below.
- **Alignment**: Centered.
- **Typography**: Title ~cap 14-16px / ~20-23px; hint ~cap 10-11px / ~14-16px.
- **Colors**: BG `#090C0A`, lime button `#D5E8B5`, dark text on button `#1A251B` (inferred), text `#F3F1E8`.
- **Graphics**: **Large lime circular button**. Lime fill `#D5E8B5`. Bbox x~41..169, y~64..176 (w~129, h~113) — roughly circular/disc shape, center (105, 120). Diameter ~110-115px. Appears as a big solid lime disc/button (no visible icon drawn inside in the analyzed rendering; the action is implied by text "Press to point").
- **Buttons**: The graphic itself is the big circular button (fill `#D5E8B5`). No pill button drawn separately.

### 3D.png
- **Text (verbatim)**: `"10:09"`, `"Jupiter"`, `"Drag to rotate"`.
- **Vertical stacking**: Clock → `"Jupiter"` title (center top) → Large 3D Jupiter disc (center) → `"Drag to rotate"` hint below disc.
- **Alignment**: Centered.
- **Typography**: Title `"Jupiter"` ~cap 16-18px / ~23-26px; hint `"Drag to rotate"` ~cap 10-11px / ~14-16px `#A8ADA5`.
- **Colors**: BG `#090C0A`, text `#F3F1E8`/`#A8ADA5`, planet tones `#DCBDA1`/`#CEAC90`/`#AD7A60`.
- **Graphics**: **Large 3D-style banded Jupiter disc**. Bbox x~23..184, y~64..227 (162×164px). Center approx (103.5, 144.5), radius ~81px (fits circle of r~81 centered at ~103.5,144.5). Strong banding: bright equatorial bands `#E3CFB4`/`#E6D1B6` (high lum ~209-212), mid bands `#CEAC90`/`#D0AE91` (~178-181), darker polar/belt regions `#A17B64`/`#A67B66`/`#9B6D56` (~120-133), very dark limb `#5E4C3F`/`#211D18`. **Red spot-like feature** present on right side: warm red-brown region around x~119-134, y~161-173 (colors `#975749`/`#9D5A4B` family), smaller concentrated area (not a huge spot in this rendering). Surface has subtle shading/highlights suggesting 3D/spherical rendering. **Bottom hint** `"Drag to rotate"` in grey `#A8ADA5` at y~217-226, centered (bbox x~65..142).
- **Buttons**: None visible as pill.

### Design intent.png
- **Size**: 568×17 px (single text strip, transparent/near-transparent background in context).
- **Text (verbatim)**: `"The real sky is the interface. The Watch reveals only what matters."`
- **Notes**: This is a tagline/intent strip, not a palette chart or layout diagram. OCR confirms exact text. For design system purposes, it reinforces the aesthetic direction (minimal, sky-focused). No explicit color swatches/radii/spacing grid are encoded as visual elements in this strip beyond the text itself; the system values above are inferred from the UI mockups.
- **Color**: Text appears as `#354338` in the strip context (dark green) per earlier notes.

---

## Quick Reference: Button Positions & Shapes
| Screen | Button | Position (y) | Shape | Fill | Label | Label Color |
|---|---|---|---|---|---|---|
| Home | Start exploring | ~182-225 | Pill (r=22, w~183) | `#D5E8B5` | "Start exploring" | `#1A251B` |
| Calibration | Start calibration | ~182-225 | Pill | `#D5E8B5` | "Start calibration" | `#1A251B` |
| Calibration Done | Finish | ~145-188 | Pill | `#D5E8B5` | "Finish" | `#1A251B` |
| Calibration Done | Calibrate again | below Finish | Text/button | (text) | "Calibrate again" | `#F3F1E8` |
| Choose object | Confirm Jupiter | ~182-225 | Pill | `#D5E8B5` | "Confirm Jupiter" | `#1A251B` |
| Object | (right chevron) | y~179-222 (x~151-194) | Circle 44x44 | `#202821` | `›` (icon) | `#F3F1E8` |
| No Match | Try again | ~182-225 | Pill | `#D5E8B5` | "Try again" | `#1A251B` |
| Button besar | Big lime button | center (y~64-176) | Circle/disc ⌀~110-115 | `#D5E8B5` | (icon implied) | — |

All measurements are from pixel-level inspection of the 208×248 PNGs. Font sizes/weights are inferred from cap-heights assuming SF Pro-like metrics.
