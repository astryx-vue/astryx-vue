---
title: Lab
---

# Lab

`@astryx-vue/lab` contains components whose APIs and interactions are still being evaluated. Upstream Astryx has no Lab section: it files these under Form Controls, Indicator, Data Visualization, and so on, marked canary. They live on one page here so that "this may change" stays visible. **The package is published only under the `canary` tag**. Props and markup may change in any canary release; stable compatibility is not guaranteed.

## Install

::: code-group
```sh [pnpm]
pnpm add @astryx-vue/lab@canary @astryx-vue/core vue
```

```sh [npm]
npm install @astryx-vue/lab@canary @astryx-vue/core vue
```

```sh [yarn]
yarn add @astryx-vue/lab@canary @astryx-vue/core vue
```

```sh [bun]
bun add @astryx-vue/lab@canary @astryx-vue/core vue
```
:::

Each component imports its own stylesheet. To load all structural styles at once:

```ts
import '@astryx-vue/lab/lab.css'
```

## Components

| Component | Purpose |
| --- | --- |
| [ListInput](/en/lab/list-input) | Edit, validate, and reorder structured records. |
| [TransferList](/en/lab/transfer-list) | Move and reorder options between two panels. |
| [Tour](/en/lab/tour) | Guide users with target highlights and step callouts. |
| [CodeEditor](/en/lab/code-editor) | Edit code with syntax highlighting and line numbers. |
| [CommentComposer](/en/lab/comment-composer) | Write a comment with a quoted passage, image attach, and an emoji picker. |
| [CommentThread](/en/lab/comment-thread) | One comment thread: first comment, replies, reactions, and a reply composer. |
| [Comments](/en/lab/comments) | A comments panel: threads, activity events, and a composer for new comments. |
| [CommentPin](/en/lab/comment-pin) | Avatar-first annotation marker for one thread or a grouped set of threads. |
| [CircularProgress](/en/lab/circular-progress) | Determinate and indeterminate ring progress. |
| [CircleCheckIndicator](/en/lab/circle-check-indicator) | The iOS multiple-selection circle, mapped to checkbox in a theme. |
| [SelectableCardGroup](/en/lab/selectable-card-group) | A set of selectable cards with radio-group or checkbox-group semantics. |
| [DialogHeroHeader](/en/lab/dialog-hero-header) | A Dialog header with full-bleed media above the title. |
| [DiffViewer](/en/lab/diff-viewer) | Unified or split diff for one file. |
| [InfoTip](/en/lab/info-tip) | Supplementary explanations for terms and metrics. |
| [LineClamp](/en/lab/line-clamp) | Clamps any content to a set number of lines, with the full text in a tooltip. |
| [LogStream](/en/lab/log-stream) | Expandable logs with an optional live tail. |
| [MediaPlayer](/en/lab/media-player) | Build your own video or audio player from play, timeline, volume, and other parts. |
| [NavigationStack](/en/lab/navigation-stack) | Drill-down navigation for phone layouts, with iOS-style push, pop and back swipe. |
| [VideoPlayer](/en/lab/video-player) | A ready-made video player whose controls float over the picture and hide when idle. |
| [AudioPlayer](/en/lab/audio-player) | A ready-made audio player with artwork, title, timeline, skip buttons, and speed. |
| [Stat](/en/lab/stat) | Key metrics and trends. |
| [SVGIcon](/en/lab/svg-icon) | Multi-variant SVG icons with per-shape roles. |
| [TabBar](/en/lab/tab-bar) | A phone app's bottom tab bar, with iOS 26's floating capsule and a selection lens that follows the finger. |
| [EmojiPicker](/en/lab/emoji-picker) | Search every emoji by group and pick one, inline or in a popover. |
| [ChatEmojiPicker](/en/lab/chat-emoji-picker) | Filter and pick an emoji from a popover grid. |
| [ChatReactionBar](/en/lab/chat-reaction-bar) | Show emoji reactions under a message and add more. |
| [Schedule](/en/lab/schedule) | Show events by month, week, day, or list. |

Every example is interactive, with the complete Vue source available on the code tab.
