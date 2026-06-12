## Avatar

**Also known as:** Portrait  ·  Profile image  ·  Profile photo  ·  User avatar  ·  User image

A visual representation of a user, typically displayed as a photo, illustration, or initials.

An avatar may use a photo as its source, but it is a UI control representing identity — for standalone content imagery, use an **Image** (see `image.md`).

**Best practices:**
- Support three sizes: small (24–32 px), medium (40–48 px), large (64–80 px)
- Fall back gracefully: image → initials → generic icon
- Use a subtle ring or border to separate the avatar from its background
- For groups, stack avatars with a slight overlap and a '+N' overflow indicator
- Ensure the image is loaded lazily with a placeholder shimmer

**Common layouts:**
- User profile header with name and role
- Comment thread with avatar beside each message
- Team member list with stacked avatar group
- Navigation bar user menu trigger

---
