## Slider

**Also known as:** Range input

A draggable control for selecting a value from within a defined range.

**Best practices:**
- Show the current value in a tooltip or adjacent label
- Use tick marks for discrete value sliders
- Support both dragging and clicking on the track to set value
- Ensure minimum touch target size for the thumb (44 px)
- Pair with a text input for precise value entry when needed
- Expose `role="slider"` with `aria-valuenow`/`aria-valuemin`/`aria-valuemax` (and `aria-valuetext` when units matter); support arrows, Home/End and Page Up/Down with a visible focus ring

**Common layouts:**
- Price range filter with dual thumbs (min/max)
- Volume/brightness control slider
- Image crop zoom level control
- Pricing page seat/usage slider with dynamic price display

---
