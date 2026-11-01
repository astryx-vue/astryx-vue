---
layout: lab-docs
title: Lab
---

# Lab

`@astryx-vue/lab` contains components whose APIs and interactions are still being evaluated. **The package is published only under the `canary` tag**. Props and markup may change in any canary release; stable compatibility is not guaranteed.

## Install

```sh
pnpm add @astryx-vue/lab@canary @astryx-vue/core vue
```

Each component imports its own stylesheet. To load all structural styles at once:

```ts
import '@astryx-vue/lab/lab.css'
```

## Components

| Component | Purpose |
| --- | --- |
| [ListInput](/en/lab/list-input) | Edit, validate, and reorder structured records. |
| [MobileTokenizer](/en/lab/mobile-tokenizer) | Search and select in a bottom sheet. |
| [TransferList](/en/lab/transfer-list) | Move and reorder options between two panels. |
| [CircularProgress](/en/lab/circular-progress) | Determinate and indeterminate ring progress. |
| [InfoTip](/en/lab/info-tip) | Supplementary explanations for terms and metrics. |
| [LogStream](/en/lab/log-stream) | Expandable logs with an optional live tail. |
| [Stat](/en/lab/stat) | Key metrics and trends. |
| [SVGIcon](/en/lab/svg-icon) | Multi-variant SVG icons with per-shape roles. |

Every example is interactive, with the complete Vue source available on the code tab.
