# Asset Category Guidelines: Main Background

## 1. Folder Purpose & Scope
This directory contains large-scale static assets designed specifically for the main body or root canvas background.

- **Behavior & Flexibility:** Positioned across the primary viewport/page canvas. Can be positioned in corners, full-bleed, or staggered across page sections.
- **Visual Goal:** Set the global ambient theme for the application without compromising content readability or visual hierarchy.
- **Sizing & Opacity:** 
  - Render at larger scales than container background assets.
  - Apply higher transparency / lower opacity (e.g., `opacity: 0.05–0.20`) compared to `container-background` to keep foreground text strictly legible.

## 2. Naming Conventions & Metadata
- **File Prefix System:** All filenames follow a categorized prefix format (e.g., `floral_*`, `non-floral_*`). Use these prefixes to infer visual characteristics if direct vision/image analysis capabilities are unavailable.
- **Selection & Distribution:** Utilize prefixes to maintain a balanced, diverse selection across categories. Select assets dynamically based on user prompts and creative intent.

## 3. Selection Rules for AI
- Ensure high contrast between text content and these background elements by keeping opacity low.
- Scale assets to cover significant canvas area without causing layout shift or scrollbar bloating.