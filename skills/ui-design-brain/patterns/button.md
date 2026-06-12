## Button

**Also known as:** CTA (in-page action)

An interactive control that triggers an action — submitting a form, opening a dialog, toggling visibility.

A control that **navigates** (to a URL, page, or anchor) is **not** a Button even when styled like one — it is a **Link** styled as a button (see `link.md`; `<button>` performs an action, `<a href>` navigates). Reserve Button for controls that trigger an in-page action.

For a persistent on/off **state** control, use a **Toggle** (see `toggle.md`), not a Button.

**Best practices:**
- Establish a clear visual hierarchy: primary (filled), secondary (outlined), tertiary (text-only)
- Use verb-first labels: 'Save changes', 'Create project', not 'Okay' or 'Submit'
- Minimum touch target of 44×44 px; desktop buttons at least 36 px tall
- Show a loading spinner inside the button during async actions — disable to prevent double-clicks
- Limit to one primary button per visible viewport section
- Ensure focus ring is visible and high-contrast for keyboard users

**Common layouts:**
- Form footer with primary action right-aligned and secondary action left-aligned
- Hero CTA button centered or left-aligned beneath headline
- Dialog footer with Cancel (secondary) and Confirm (primary)
- Floating action button (FAB) in bottom-right for mobile creation flows

---
