## Date input

A date entry control, often split into separate day, month, and year fields.

When users benefit from a visual calendar, use a **Datepicker** (see `datepicker.md`) instead.

**Best practices:**
- Clearly label the expected format (DD/MM/YYYY or MM/DD/YYYY)
- Use separate fields for day, month, and year for unambiguous entry
- Validate in real-time and show errors inline
- Support auto-advancing between fields when a segment is complete
- Label each segment, support Tab and arrow movement between fields, and tie validation errors to the field with `aria-invalid` and `aria-describedby`

**Common layouts:**
- Date of birth entry in a registration form
- Passport/ID expiry date input
- Invoice date field in a financial form

---
