---
title: Typography
---

# Typography

Two font stacks live on Neutral's semantic tokens.

`--astryx-font-family-body` and `--astryx-font-family-heading` start with Figtree, then `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Helvetica`, `Arial`, and `sans-serif`. `--astryx-font-family-code` starts with JetBrains Mono, then `ui-monospace`, `SFMono-Regular`, `Menlo`, `Consolas`, and `monospace`.

The theme package loads Figtree and JetBrains Mono at 400, 500, 600, 700, and 400 italic. Figtree also includes 600 italic. Importing a theme entry loads both faces.

Weight tokens are `--astryx-font-weight-normal` (400), `medium` (500), `semibold` (600), and `bold` (700). `--astryx-font-weight-regular` points at `normal`. Components already use that name. Upstream calls the token `normal`.

The `type` values on `Text` and `Heading` map to the `--astryx-text-*` sizes, weights, and line heights: `display-1` through `display-3`, and body, large, label, code, and supporting. Display sizes use weight 400. Scale comes from size, not from bold.

`Heading` also takes `level` from 1 to 6, which renders `h1` to `h6` and sets that level's default size, weight, and line height. When the outline calls for an `h2` at a different size, override it with `type`.

<TokenReference locale="en" :sections="['font', 'type']" />

## Do and don't

Bigger is not better. One rule of thumb: body text is `body`, a page gets one `display-1` through `display-3`, and everything else separates itself by level.

**Do:**

- Use one `display-*` per page. A landing page hero and a key figure on a dashboard are the two places it earns its keep. Display weight is 400; the size carries the impact, not bold.
- Pick `level` by outline. If the page runs `h1` then `h2` then `h3`, write that. When a size looks wrong, adjust `type` or `weight` on the spot; don't skip a level to get a size.
- Put supporting text in `supporting`. Table notes, timestamps, and help text belong there: 12px instead of the body's 14px, in the secondary color.
- Use `type="code"` on `Text`, or the `Code` component, for inline code. Both switch to the monospace stack.
- Wrap headings with `text-wrap="balance"` and body text with `text-wrap="pretty"`. The first evens out a two-line heading; the second avoids a lone word on the last line.
- Pair long text with `max-lines`. A truncated `Heading` or `Text` shows the full string in a tooltip on hover.

**Don't:**

- Don't use `h4` as a small section heading. `level` 4 is the 14px bold eyebrow size, smaller than `level` 5. For a step down, use `level="5"`, or give the `h4` a `type`.
- Don't express importance with size. Important things get weight, color, and position; size belongs to hierarchy.
- Don't hand-write `font-size` and `line-height`. `font-size: 18px` drifts from the `--astryx-text-*` line height and weight, and a theme change leaves it misaligned.
- Don't add `letter-spacing` to headings for style. On Chinese text it only looks loose.
- Don't set long body copy in all caps. Eyebrows and labels are fine; sentences are hard work.
- Don't mix more than three sizes in one block. If it needs more hierarchy, use a list or a subheading.
