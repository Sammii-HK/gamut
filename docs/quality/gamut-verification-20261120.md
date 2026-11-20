# Gamut local product verification, 20 November 2026

Unreleased isolated branch `codex/gamut-product-polish`. The owner's main checkout was clean when inspected and was left untouched. No environment files were copied or read, no database or provider calls were made, and nothing was pushed or deployed.

## Repaired behaviour

Semantic references previously used scale IDs while the preview and export lookup used editable names. Renaming primary or neutral therefore lost the reference and resolved colours to the grey fallback. Palettes now carry stable IDs, and preview, CSS, JSON and Style Dictionary all use the same ID lookup. Renaming changes the label and exported scale key while preserving the selected semantic colour.

Shared URLs now encode IDs and names independently with a versioned JSON value. Punctuation and duplicate names survive a round trip, and the active scale remains selected after a rename. Existing base and comma-separated scale links remain readable. Invalid colours, roles, repeated IDs and malformed payloads fall back to the default editor instead of entering colour calculations.

Export keys are sanitised and disambiguated, including reserved dictionary names, so duplicate or punctuation-heavy display labels do not overwrite scales or create malformed Tailwind source. The interface explains that export keys are normalised.

Scale selection is a labelled keyboard button; rename and role controls are named; remove controls are visible and labelled. Picker tabs and export choices expose their selected state. Inputs have labels and focus rings. Controls have a 44px minimum height. Clipboard failures are handled instead of reporting success. Swatches wrap on narrow screens. Contrast failures use Lucide rather than a typed glyph. The footer no longer claims the whole application has no dependencies.

Gamut remains an OKLCH theme workshop. This work does not turn it into Saer or claim shared registry capabilities.

## Automated evidence

- Five meaningful regressions pass: rename stability in light/dark across semantic exports; custom-role scale references; safe unique export keys with executable Tailwind syntax; stable URL round trips and legacy links; malformed shared state rejection.
- Shared icon guard reports zero violations and zero data symbols. Eight guard regression tests pass.
- TypeScript and the production build pass with Next 16.4.6. The build creates the home and not-found routes. Fonts use system stacks, avoiding a build-time external font fetch.
- Dependency audit: zero vulnerabilities after safe dependency patches.

## Browser evidence

Production build served at `http://127.0.0.1:4814`. Fresh agent-owned tabs; the parent’s Glint tab was untouched.

- Set the visible Hex input to `#8544cc`, then renamed primary to Orchid and neutral to Slate. The Primary preview button stayed `rgb(137, 73, 209)` with text `rgb(247, 243, 255)` before and after both renames. CSS and dark JSON exports retained `--primary-solid: #8949d1`; no grey fallback appeared.
- Added another scale, renamed it Orchid too and assigned Accent. JSON exposed separate orchid and orchid-2 keys, with accent `#d18500`. Reload retained all three names, stable IDs, roles, the active added scale and dark mode.
- The preview notification switch changed checked state using Space. The Disabled example is exposed as disabled.
- Desktop viewport 1144px: no horizontal overflow, and all visible buttons/text fields/selects measured at least 44px high. The first browser view exposed oversized two-row swatches, so the final build uses an 11-column desktop scale and provides direct Scales, Palette, Preview and Export links.
- Phone viewport 390px: document width 384px (the remaining 6px is the vertical scrollbar), no horizontal overflow. The Preview link placed its section at 24px from the top. Visible controls and section links measured at least 44px high. Contrast checks expand on demand.
- Export copy showed Copied after the browser resolved its clipboard write. The automation clipboard reader returned an empty value, so actual clipboard content was not independently verified. Clipboard denial handling was reviewed in source, not induced through browser permissions.
- Viewport override reset, confirmed back at 1144px, before handing browser ownership to the Flip agent.

Actual local, unreleased screenshots, kept outside the code commit in `.codex-artifacts`:

- `gamut-desktop-editor.jpg`: final desktop editor with renamed purple primary, neutral and duplicate named amber accent.
- `gamut-phone-preview.jpg`: actual 390px preview with purple primary and amber accent.
- `gamut-phone-scales.jpg`: actual 390px scale controls with contrast checks expanded.

These are local tool states, not deployed screenshots.

## Remaining limits

Contrast badges compare each generated step against white and black for normal-text thresholds. They do not certify every semantic pair, component interaction, focus state or complete design system. Shared links can become long as scales accumulate. CSS and JSON export reflect the current mode; Style Dictionary contains both modes; the Tailwind export contains raw colour scales. The contrast algorithm and gamut-clamping maths were preserved and were not independently re-certified in this pass.
