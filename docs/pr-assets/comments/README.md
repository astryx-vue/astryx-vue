# Comments comparison shots for #478

Left: Meta Astryx Storybook `lab-comments--panel` at https://astryx.atmeta.com/storybook (v0.7.13 API; `git diff v0.7.13 origin/main` on Comments paths is empty). Official toolbar globals use `colorMode` (not `theme`); Storybook theme globals alone may not flip `data-theme`, so the dark captures set `globals=colorMode:dark;astryxTheme:neutral`.

Right: astryx-vue docs page `/en/lab/comments` from this branch, first demo (Comments panel). VitePress appearance and `data-theme` / `color-scheme` were set explicitly.

Captured on 2026-11-12 (Asia/Shanghai) with Playwright Chromium, desktop 1280 and 390px, light and dark. Both sides show the official showcase rest state: Load earlier comments, Maya Chen's open rollout-plan thread (replies, agent progress, typing), the "Rollout checklist attached" event, and the new-comment composer.

Known visual differences, all expected of this Vue port: Vue has no OverflowList measurement, so header actions do not collapse the same way; Vue Comments sets `showScrollButton` to false, so the official panel's jump-to-bottom control is absent; ChatLayout dock padding tokens are slightly different; the `New` unread badge sits inline with the metadata on Vue rather than trailing the row.
