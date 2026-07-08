## 2025-05-15 - Sidebar Accessibility and Safety Pattern
**Learning:** Decorative emojis in navigation links cause noise for screen readers, and destructive actions like "New Franchise" are prone to accidental clicks without a confirmation guard. Standard keyboard focus indicators were missing.
**Action:** Wrap decorative emojis in `<span aria-hidden="true">`, use `aria-current="page"` for active links, and implement `window.confirm` for destructive state resets. Use `focus-visible:ring-2 focus-visible:ring-orange/50 outline-none` for consistent keyboard accessibility.
