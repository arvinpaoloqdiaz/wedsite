# Asset Category Guidelines: Divider

## 1. Folder Purpose & Scope
This directory contains static assets designed exclusively for horizontal content separation and section dividers.

- **Behavior & Flexibility:** strictly intended for horizontal alignment. Do not scale vertically or rotate in ways that break the horizontal dividing axis.
- **Continuous Tile Rule:** Files suffixed with `-cont` (e.g., `floral_border_01-cont.png`) are seamless tiles designed to repeat continuously across the horizontal axis (`background-repeat: repeat-x` or flex layout tiling).
- **Visual Goal:** Provide clean, structural section breaks across web pages or UI panels.

## 2. Naming Conventions & Metadata
- **File Prefix System:** All filenames follow a categorized prefix format (e.g., `floral_*`, `non-floral_*`). Use these prefixes to infer visual characteristics if direct vision/image analysis capabilities are unavailable.
- **Selection & Distribution:** Utilize prefixes to maintain a balanced, diverse selection across categories. Select assets dynamically based on user prompts and creative intent.

## 3. Selection Rules for AI
- Check filename for the `-cont` suffix when a full-width repeating divider is required.
- Standardize height across continuous divider chains to prevent visual distortion.
- Do not use divider assets as standalone floating decorations or background overlays.