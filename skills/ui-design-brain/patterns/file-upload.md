## File upload

**Also known as:** Dropzone  ·  File input  ·  File uploader

A control that lets users select and upload files from their device.

Once an upload completes, display each item with the **File** pattern (see `file.md`).

**Best practices:**
- Support drag-and-drop with a clearly defined drop zone
- Show accepted file types and size limits before upload
- Display upload progress with a progress bar per file
- Allow cancellation of in-progress uploads
- Show a preview (thumbnail for images, icon + name for documents) after selection
- Validate file type and size client-side before uploading
- Pair the dropzone with a real `<input type="file">`, keep it keyboard-focusable, and announce upload progress and errors via a live region

**Common layouts:**
- Profile photo upload with circular crop preview
- Document attachment area in a form
- Multi-file drag-and-drop zone with file list below
- Inline file field with browse button and filename display

---
