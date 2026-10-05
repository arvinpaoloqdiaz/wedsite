# Asset Category Guidelines: Landing Page

## 1. Folder Purpose & Scope
This directory contains static decorative assets restricted exclusively to the main landing page view.

- **Behavior & Positioning:** Assets exhibit garland-like framing behaviors and should be anchored primarily to screen corners, page borders, and container edges.
- **Sizing & Scaling:** Scale assets proportionally to fit the viewport dimensions so they naturally frame the Hero section without invading the central call-to-action or primary text areas.
- **Visual Goal:** Create a rich, welcoming framing aesthetic for first-time page visitors while keeping the central content area clean and readable.

## 2. Naming Conventions & Metadata
- **File Prefix System:** All filenames follow a categorized prefix format (e.g., `floral_*`, `non-floral_*`). Use these prefixes to infer visual characteristics if direct vision/image analysis capabilities are unavailable.
- **Selection & Distribution:** Utilize prefixes to maintain a balanced, diverse selection across categories. Select assets dynamically based on user prompts and creative intent.

## 3. Selection Rules for AI
- Restrict usage strictly to the landing page canvas; do not render these assets on sub-pages or inner dashboard views.
- Anchor to top/bottom corners or side margins (`top-0`, `left-0`, `bottom-0`, `right-0`) with appropriate CSS transforms or rotation.
- Scale down on mobile viewports to prevent edge garlands from crowding smaller screen real estate.