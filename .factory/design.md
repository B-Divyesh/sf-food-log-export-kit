# Visual thesis — the archive at dusk

## Direction and purpose

Food Log Export Kit uses cinematic environmental art. A dark kitchen at blue hour holds a warm pool of light, paper recipe cards, and a small metal archive box. The image turns an abstract migration into a physical act: the user's food history leaves a failing screen and becomes a durable archive they can hold. The interface borrows the scene's quiet contrast and ruled-paper details. It must feel like a careful preservation tool, not a calorie dashboard.

## Tokens

- `ink`: `#18201d` — primary text on paper
- `paper`: `#f4efdf` — warm main background
- `paper-raised`: `#fffaf0` — fields and elevated rows
- `forest`: `#183b32` — deep controls and night surfaces
- `forest-deep`: `#0c2722` — site footer and app rail
- `moss`: `#356b55` — focus and secondary action
- `apricot`: `#d86d3c` — primary action and selected state
- `apricot-dark`: `#8f381f` — accessible link and hover color
- `amber`: `#efb85a` — warnings and lamplight accents
- `success`: `#267052`; `danger`: `#9b382d`
- Dark treatment is limited to the header, hero sky, and app rail. Work surfaces stay paper-light so dense nutrition tables remain readable.

All text/control pairings meet WCAG AA. Color is always paired with text or an icon.

## Type and spacing

- Display: Georgia, Cambria, `Times New Roman`, serif. The sturdy book face recalls handwritten recipe binders without loading a font.
- Body and data: Inter-like system stack (`-apple-system`, BlinkMacSystemFont, `Segoe UI`, sans-serif). Tabular figures are enabled in tables.
- Scale: 14, 16, 18, 24, 36, and clamp(44–72) px.
- Spacing follows 4/8 px: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Reading measure is 68 characters. Work tables use the available width.

## Shape and interaction grammar

The recurring shape is a clipped archive label: small corner cuts, fine rules, and a single apricot registration mark. Buttons use modest 8 px corners, not pills. The app moves left to right through four numbered stages: import, review, export, keep. Rows resemble ruled ledger entries. Status changes appear as stamped labels with both words and symbols.

Focus uses a 3 px amber ring plus a dark offset. Touch targets are at least 44 px. On phones, tables turn into labeled record cards and the stage rail becomes a horizontal scroll.

## Motion

The signature motion is a short “drawer opens” reveal: new panels translate upward 8 px while fading in over 220 ms. Progress fill moves only after a user action. Nothing loops. With `prefers-reduced-motion`, translation and smooth scrolling are removed; state changes are instant opacity swaps.

## Asset plan and prompt sheet

Hero asset: a wide environmental still used on the site and cropped inside the app welcome panel. Social art is composed from the same source.

Walkthrough assets: three original browser captures of the working import, conversion-note, and populated review states. They are stored in `public/screens/` and compressed as WebP.

Prompt: “Cinematic environmental still life in a quiet lived-in kitchen at blue hour, an open dark green metal recipe archive box on a worn wooden table, several cream recipe cards and a small blank phone face nearby, warm tungsten window-side lamp cutting through cool teal evening shadows, subtle floating dust, tactile paper and brushed metal, 35mm lens, eye-level wide composition, generous dark negative space on the left, restrained palette of forest green, parchment cream, burnt apricot and amber, realistic but gently painterly, no people, no food brand packaging, no legible writing, no text, no logos, no watermark.”

Negative list: people, hands, anatomy, brand marks, app UI, text, letters, watermark, oversaturated neon, glossy SaaS gradient, medical imagery, scales, measuring tape.

Provenance: generated for this product on 2026-08-28 with the Param Factory Azure image deployment using `/opt/fleet/lib/gen-image.sh`. The shipped derivative is original project artwork. Source prompt metadata lives beside the source image in `assets/src/`.
