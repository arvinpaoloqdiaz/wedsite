# Asset Category Guidelines: Container Background

## 1. Folder Purpose & Scope
This directory contains static visual assets designed to decorate individual UI containers or card elements.

- **Behavior & Flexibility:** Assets act like decorative stickers. They can be resized, rotated, and positioned to slightly overflow container edges (clipped/cropped by `overflow: hidden` on the container).
- **Visual Goal:** Enhance container aesthetics without drawing primary focus away from text or core interactive elements.
- **Opacity Default:** Apply a slight default transparency (e.g., `opacity: 0.15–0.40`) so the asset blends subtlely into the container background.

## 2. Naming Conventions & Metadata
- **File Prefix System:** All filenames follow a categorized prefix format (e.g., `floral_*`, `non-floral_*`). Use these prefixes to infer visual characteristics if direct vision/image analysis capabilities are unavailable.
- **Selection & Distribution:** Utilize prefixes to maintain a balanced, diverse selection across categories. Select assets dynamically based on user prompts and creative intent.

## 3. Selection Rules for AI
- Anchor assets near container corners or edges to allow intentional overflow clipping.
- Adjust opacity relative to the container's background color contrast.
- Balance floral vs. non-floral prefixes according to the overall prompt theme.