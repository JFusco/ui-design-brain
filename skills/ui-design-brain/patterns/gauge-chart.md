## Gauge chart

A semicircular quantitative visualization that places a current value against a bounded scale and optional qualitative ranges.

For part-to-whole proportions across categories, use a **Pie chart** (see `pie-chart.md`).

**Best practices:**
- State the scale minimum, maximum, current value, and unit in text as well as graphically.
- Clamp out-of-range values visually while preserving the actual value in supporting copy.
- Use semantic color ranges only when their meaning is explained in a legend or adjacent text.
- Respect reduced-motion preferences and avoid making animation necessary to understand the value.
- Give the rendered chart an accessible name with `aria-label` or a referenced visible heading, and keep its SVG title synchronized.
- Provide a text or tabular equivalent when the exact value or thresholds are decision-critical.

**Common layouts:**
- KPI card with a compact semicircular gauge
- Dashboard panel comparing current performance with a target
- Status summary with qualitative threshold bands
- Report section pairing a gauge with explanatory copy

---
