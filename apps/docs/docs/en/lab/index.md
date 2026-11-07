---
title: Lab
---

# Lab

`@astryx-vue/lab` contains components whose APIs and interactions are still being evaluated. Upstream Astryx has no Lab section: it files these under Form Controls, Indicator, Data Visualization, and so on, marked canary. They live on one page here so that "this may change" stays visible. **The package is published only under the `canary` tag**. Props and markup may change in any canary release; stable compatibility is not guaranteed.

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
| [Tour](/en/lab/tour) | Guide users with target highlights and step callouts. |
| [CodeEditor](/en/lab/code-editor) | Edit code with syntax highlighting and line numbers. |
| [CircularProgress](/en/lab/circular-progress) | Determinate and indeterminate ring progress. |
| [DiffViewer](/en/lab/diff-viewer) | Unified or split diff for one file. |
| [InfoTip](/en/lab/info-tip) | Supplementary explanations for terms and metrics. |
| [LogStream](/en/lab/log-stream) | Expandable logs with an optional live tail. |
| [Stat](/en/lab/stat) | Key metrics and trends. |
| [SVGIcon](/en/lab/svg-icon) | Multi-variant SVG icons with per-shape roles. |

Every example is interactive, with the complete Vue source available on the code tab.
