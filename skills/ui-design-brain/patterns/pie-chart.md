## Pie chart

A circular part-to-whole visualization that divides a total into labeled proportional segments, optionally with a central void.

For values against a bounded scale, use a **Gauge chart** (see `gauge-chart.md`).

**Best practices:**
- Use only when every segment belongs to the same meaningful whole and totals can be interpreted consistently.
- Keep the number of segments small enough for labels and proportions to remain distinguishable.
- Show category labels and values or percentages outside color alone.
- Order segments deliberately and keep legend order aligned with visual order.
- Respect reduced-motion preferences and do not depend on animation to reveal the data.
- Give the rendered chart an accessible name with `aria-label` or a referenced visible heading, and provide a text or table equivalent for exact comparison.

**Common layouts:**
- Dashboard card showing a compact category breakdown
- Report section pairing the chart with a legend
- Donut chart with a summarized total in the center
- Responsive figure followed by an equivalent data table

---
