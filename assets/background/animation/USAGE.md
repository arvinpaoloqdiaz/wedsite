# Asset Category Guidelines: Animation

## 1. Folder Purpose & Scope
This directory contains dynamic assets intended for ambient background animations (e.g., falling motion, lateral swaying, rotational drift).

- **Behavior & Flexibility:** Assets are not restricted to a linear timeline. You may rotate, scale, translate, or adjust opacity as needed to ensure smooth, natural visual transitions.
- **Visual Goal:** Maintain realistic movement (e.g., leaves floating and swaying in the wind) strictly as a subtle background effect. It must never distract from the main content.
- **Lifecycle & Performance:** 
  - Limit active instances—do not render all assets on-screen simultaneously.
  - Animate randomly selected assets into view, let them traverse off-screen, and unmount/destroy them once out of bounds to optimize memory and maintain uniform flow.

## 2. Naming Conventions & Metadata
- **File Prefix System:** All filenames follow a categorized prefix format (e.g., `floral_*`, `non-floral_*`). Use these prefixes to infer visual characteristics if direct vision/image analysis capabilities are unavailable.
- **Selection & Distribution:** Utilize prefixes to maintain a balanced, diverse selection across categories. Select assets dynamically based on user prompts and creative intent.

## 3. Selection Rules for AI
- Parse the user's prompt to identify key visual themes.
- Evenly sample across appropriate prefixes unless a specific theme is requested.
- Prioritize natural randomness and performance over dense layout composition.