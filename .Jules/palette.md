## 2026-08-26 - Mobile Menu Button Accessibility Attributes
**Learning:** Icon-only overlay controls and toggle buttons require explicit `aria-label` and `aria-expanded` attributes so screen readers accurately communicate the state and action of mobile navigation drawers.
**Action:** Always verify overlay close buttons and toggles include dynamic accessibility state attributes.

## 2026-08-26 - Floating AI Chat Dialog Accessibility
**Learning:** Floating AI chatbot popups require `role="dialog"`, explicit `aria-label`, `aria-expanded`, and `aria-controls` on the trigger, plus `role="status"` with live screen reader text on loading indicators to remain usable for screen readers and keyboard users.
**Action:** Always pair floating modal/dialog triggers with dynamic ARIA expand states and proper dialog accessibility markup.
