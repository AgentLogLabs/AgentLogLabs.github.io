# Design System Specification: The Intelligence Ledger

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Curator."** 

Unlike standard developer tools that present a "wall of data," this system treats information as a high-end editorial experience. It balances the raw, utilitarian power of a terminal with the sophisticated polish of a premium workspace. We break the "template" look by eschewing rigid 1px dividers in favor of **Tonal Topography**—using subtle shifts in background values to define space. The result is a UI that feels deep, layered, and intentional, mirroring the complexity of AI agents while maintaining the local-first security of a private vault.

---

## 2. Colors: Tonal Depth & AI Fluency
We utilize a Material-based palette specialized for a high-performance dark mode environment.

### The Palette
- **Primary Architecture (`#a4e6ff` to `#00d1ff`):** Represents "Active Intelligence." Use these electric blues for high-impact AI actions and primary success states.
- **Surface Hierarchy:** 
    - `surface` (#0b1326): The "Void." Used for the primary application background.
    - `surface-container-low` (#131b2e): Secondary sidebars or utility panels.
    - `surface-container-high` (#222a3d): Content cards and active session logs.
- **The "Warning" Axis (`secondary` #ffe2ab):** Reserved exclusively for 'Uncommitted' states or local-only data that hasn't been synced/finalized.

### Core Visual Rules
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for structural sectioning. To separate a sidebar from a main feed, transition from `surface` to `surface-container-low`. Contrast is our divider.
*   **Signature Textures:** For high-level AI summaries, apply a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle. This adds "soul" to the data.
*   **Glassmorphism:** Overlays (Modals, Command Palettes) must use `surface_container_highest` at 70% opacity with a `20px` backdrop-blur. This ensures the developer never loses the context of their logs beneath the UI.

---

## 3. Typography: Monospace Utility meets Editorial Precision
We pair the technical rigor of monospaced fonts with the approachable clarity of modern sans-serifs.

*   **The Technical Core (JetBrains Mono / Fira Code):** Used for all `body` and `label` tokens where data, code, or session logs are present. This reinforces the "Developer-First" ethos.
*   **The Editorial Frame (Space Grotesk / Inter):** 
    - **Display & Headline:** Use `spaceGrotesk` for titles. Its geometric quirks provide a futuristic, intelligent "signature" that distinguishes the system from a standard IDE.
    - **UI Labels:** Use `inter` for navigation and button labels for maximum legibility at small scales.

---

## 4. Elevation & Depth: Tonal Layering
In this system, elevation is not about "distance from the screen" via shadows, but "density of information" via color.

*   **The Layering Principle:** 
    - Base Level: `surface_dim` (#0b1326).
    - Floating Content: `surface_container_low` (#131b2e).
    - Active Interaction: `surface_container_highest` (#2d3449).
*   **Ambient Shadows:** For floating elements like tooltips, use a shadow with a `24px` blur, 0px offset, and 8% opacity using the `on_surface` color. This creates a soft "glow" of importance rather than a heavy drop shadow.
*   **The "Ghost Border" Fallback:** If a boundary is required for accessibility (e.g., input fields), use the `outline_variant` (#3c494e) at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Fluid Primitives

### Buttons
*   **Primary AI Action:** Solid `primary` background. Text in `on_primary`. High-contrast, vibrant.
*   **Secondary/Uncommitted:** A "Ghost" style. No background, just a `primary_fixed_dim` text with a 0.5px `outline_variant` border (10% opacity).
*   **Tertiary:** Pure text using `on_surface_variant`. No container.

### Data Logs & Cards
*   **Constraint:** No dividers. 
*   **Implementation:** Use `spacing.4` (0.9rem) of vertical white space to separate log entries. For "High Priority" logs, shift the background to `surface_container_high`.
*   **Status Chips:** Use `secondary_container` (#ffbf00) for "Uncommitted" states. These should be pill-shaped (`rounded-full`) and small (`label-sm`).

### Input Fields
*   **Style:** Background-less. Only a bottom border using `outline_variant` at 20% opacity. Upon focus, the bottom border transitions to a `primary` 2px line with a subtle `primary` outer glow (4px blur).

### Specialized Component: The "Context Pulse"
*   For AI-driven "Resume Context" features, use a container with a `surface_container_lowest` background and a `primary` left-border accent (4px wide). This signals that the AI is "reading" this section.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts. A log entry can be wider than the header above it to create a sense of organic growth.
*   **Do** use `spaceGrotesk` for large numbers or metrics (e.g., "99% Accuracy").
*   **Do** leverage `surface-container` tiers to nest content (e.g., a `surface-container-high` card inside a `surface-container-low` sidebar).

### Don't:
*   **Don't** use pure black (#000000). It kills the "VS Code vibe" and creates too much contrast for long-term developer use.
*   **Don't** use standard "Success Green." Use the Electric Blue/Teal (`primary`) for all positive, AI-verified actions to keep the palette focused.
*   **Don't** use heavy shadows. If a component feels "flat," increase its background lightness by one `surface-container` tier instead of adding a shadow.

---

## 7. Spacing & Rhythm
We follow a strict `0.2rem` (4px) base unit, but encourage large gaps (`spacing.12` or `spacing.16`) between major functional groups to prevent the "cluttered dashboard" syndrome. White space in this system is a tool for focus, not just a gap.