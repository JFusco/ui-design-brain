## Rich text editor

**Also known as:** RTE  ·  WYSIWYG editor

A WYSIWYG editing surface for creating and formatting rich text content.

For a read-only render of already-authored content, use a **Rich text** (see `rich-text.md`) — this is the editing surface; that is its rendered output.

**Best practices:**
- Provide a minimal default toolbar — reveal advanced formatting on demand
- Support keyboard shortcuts for common formatting (Cmd+B, Cmd+I)
- Ensure pasted content is sanitized to prevent layout-breaking HTML
- Show a word/character count for content with limits

**Common layouts:**
- Blog post editor with formatting toolbar and preview
- Email composer with rich text and attachment support
- Comment editor with basic formatting (bold, italic, link, list)

---
