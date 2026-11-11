# CommentThread comparison shots for #478

Left: Meta Astryx Storybook `lab-comments--margin-comment` at https://astryx.atmeta.com/storybook (v0.7.13 API; `git diff v0.7.13 origin/main` on CommentThread paths is empty). Official toolbar globals use `colorMode` (not `theme`); Storybook theme globals alone may not flip `data-theme`, so the dark captures set `globals=colorMode:dark`.

Right: astryx-vue docs page `/en/lab/comment-thread` from this branch. VitePress appearance and `data-theme` / `color-scheme` were set explicitly.

Captured on 2026-11-12 (Asia/Shanghai) with Playwright Chromium, desktop 1280 and 390px, light and dark. Both sides show the collapsed margin-comment rest state (quoted passage, Maya Chen's comment, "View 1 reply"). Vue has slightly more vertical space under the quote than React; header action overflow (no OverflowList) is not visible in this rest state.
