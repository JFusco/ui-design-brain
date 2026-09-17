## Datepicker

**Also known as:** Calendar  ·  Date Picker  ·  DateRangePicker  ·  Datetime picker

A calendar-based control for selecting dates visually.

For keyboard-only entry through separate day/month/year fields, use a **Date input** (see `date-input.md`).

**Best practices:**
- Allow both manual text entry and calendar selection
- Clearly indicate the expected date format (e.g., MM/DD/YYYY)
- Highlight today's date and the currently selected date
- Disable dates outside the valid range
- Support keyboard navigation through the calendar grid
- For date ranges, show both start and end in a connected picker
- Render the calendar in a labelled dialog (`role="dialog"`, `aria-modal`), make grid cells arrow-navigable with a visible focus ring, and announce the selected date

**Common layouts:**
- Booking flow with check-in / check-out range picker
- Form field with calendar dropdown on focus
- Dashboard date range filter in a toolbar
- Event creation form with start date and optional end date

---
