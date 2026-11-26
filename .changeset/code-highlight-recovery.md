---
'@astryx-vue/core': patch
---

CodeBlock and CodeEditor syntax highlighting repaints itself after the code is moved in the DOM (for example by a scroll container or Teleport), instead of losing its colors. `useLayer` now returns `reposition()` to realign a layer right away when its anchor moves.
