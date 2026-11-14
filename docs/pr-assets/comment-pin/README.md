# CommentPin comparison shots for #478

Left: Meta Astryx Storybook `lab-commentpin--over-content-and-in-margin` at https://astryx.atmeta.com/storybook (v0.7.13 API; `git diff v0.7.13 origin/main` on CommentPin paths is empty). Official toolbar globals use `colorMode` (not `theme`); Storybook theme globals alone may not flip `data-theme`, so the dark captures set `globals=colorMode:dark;astryxTheme:neutral`. The official placement canvas is a fixed 520px wide; the 390px official shots scale that canvas to fit so the margin pin stays in frame.

Right: astryx-vue docs page `/en/lab/comment-pin` from this branch, first demo (the same Over content and in margin placement canvas). VitePress appearance and `data-theme` / `color-scheme` were set explicitly. The Vue demo uses `max-width: 100%`, so the 390px shots are a naturally narrower canvas rather than a scaled 520px frame.

Captured on 2026-11-12 (Asia/Shanghai) with Playwright Chromium, desktop 1280 and 390px, light and dark. Both sides show the rest state: the grouped Ada + Lin pin of 4 threads starts selected over the unsplash desk photo; Mira's single pin sits in the right margin and is dimmed.

Known visual differences, all expected of this Vue port: Vue Avatar 22px / 28px sizes are passed as numeric sizes (those values are not in Vue's public `AvatarNumericSize` union, but `resolveSize` accepts them at runtime); forced-colors styling is implemented with a CSS `@media (forced-colors: active)` query rather than StyleX atomic classes; the tooltip is the Vue core `Tooltip` (Teleport / popover implementation). ChatEmojiPicker is not renamed or replaced.
