---
'@astryx-vue/core': patch
---

Focus conditionally mounted Dialog headers after the dialog opens and restore focus to the saved opener on close. Keep MobileNav mounted and focus-contained through its 300 ms exit animation, while reduced-motion users still close immediately.
