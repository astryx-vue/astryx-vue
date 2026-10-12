---
title: 间距、圆角与阴影
---

# 间距、圆角与阴影

间距从 `--astryx-spacing-0` 到 `--astryx-spacing-12`，步长是 4px，中间有 `0.5` 和 `1.5`。控件高度是 `--astryx-size-element-sm`（28px）、`md`（32px）、`lg`（36px）。

圆角从 `--astryx-radius-none` 到 `--astryx-radius-full`。`--astryx-radius-none` 在这个包里保持 `0`，不采用原版 Neutral 的 `0.25rem`。`--astryx-radius-chat` 是 28px；Neutral 没有单独覆盖它，在 16px 根字号下等于页面圆角 `1.75rem`。

阴影有 `low`、`med`、`high` 三档外阴影，以及悬停、选中、成功、警告、错误五种内阴影。外阴影带偏移和模糊，明暗两套不一样。

焦点环用 `--astryx-focus-outline-width`、`style`、`color`、`offset`。颜色跟随 `--astryx-color-accent`。

<TokenReference :headings="true" locale="zh" :sections="['spacing', 'size', 'border', 'focus', 'radius', 'shadow']" />
