## Skeleton

**Also known as:** Skeleton loader

A low-fidelity placeholder that mimics the shape of content while it loads, typically rendered as grey blocks.

**Best practices:**
- Match the skeleton shape to the actual content layout as closely as possible
- Use a subtle shimmer/pulse animation to indicate loading — not a spinner
- Avoid skeletons for very fast loads (<300 ms) — they add visual noise
- Show skeleton immediately on navigation; replace atomically when data arrives
- Use muted, low-contrast colors (light gray on white) for skeleton blocks

**Common layouts:**
- Card grid skeleton with image placeholder, title bar, and text lines
- List/feed skeleton with repeating row shapes
- Profile page skeleton with avatar circle and text blocks
- Dashboard skeleton with chart placeholder and metric blocks

---
