---
title: Typography
---

# Typography

Two font stacks live on Neutral's semantic tokens.

`--astryx-font-family-body` and `--astryx-font-family-heading` start with Figtree, then `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Helvetica`, `Arial`, and `sans-serif`. `--astryx-font-family-code` starts with JetBrains Mono, then `ui-monospace`, `SFMono-Regular`, `Menlo`, `Consolas`, and `monospace`.

The theme package loads JetBrains Mono at 400, 500, 600, 700, and 400 italic. It does not load Figtree. The docs site loads Figtree itself, through `@fontsource/figtree`, at 400, 500, 600, 700, and some italics. An app that wants Figtree has to load the face. Otherwise the stack falls through to the system sans.

Weight tokens are `--astryx-font-weight-normal` (400), `medium` (500), `semibold` (600), and `bold` (700). `--astryx-font-weight-regular` points at `normal`. Components already use that name. Upstream calls the token `normal`.

The `type` values on `Text` and `Heading` map to the `--astryx-text-*` sizes, weights, and line heights: `display-1` through `display-3`, headings 1 through 6, and body, large, label, code, and supporting. Display sizes use weight 400. Scale comes from size, not from bold.

<TokenReference locale="en" :sections="['font', 'type']" />
