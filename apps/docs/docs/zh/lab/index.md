---
title: Lab
---

# Lab

`@astryx-vue/lab` 收录仍在验证 API 和交互的组件。原版 Astryx 没有单独的 Lab 分区，这些组件按用途分在 Form Controls、Indicator、Data Visualization 等分类里，只是标了 canary；这里单独放一页，是为了让「会变」这件事一眼可见。**这个包只通过 `canary` 标签发布**，属性和标记可能在任何 canary 版本中变化，不承诺稳定版兼容。

## 安装

```sh
pnpm add @astryx-vue/lab@canary @astryx-vue/core vue
```

每个组件会导入自己的样式。也可以一次引入全部结构样式：

```ts
import '@astryx-vue/lab/lab.css'
```

## 组件

| 组件 | 用途 |
| --- | --- |
| [ListInput](/lab/list-input) | 编辑、校验和排序一组记录。 |
| [MobileTokenizer](/lab/mobile-tokenizer) | 在底部面板中搜索和多选。 |
| [TransferList](/lab/transfer-list) | 在可选与已选面板之间移动并排序。 |
| [Tour](/lab/tour) | 用目标高亮和步骤弹层引导用户。 |
| [CodeEditor](/lab/code-editor) | 编辑带语法高亮和行号的代码。 |
| [CommentComposer](/lab/comment-composer) | 写一条评论：可带引用段落、添加图片和表情。 |
| [CommentThread](/lab/comment-thread) | 单独的评论线程：首条评论、回复、表情回应和回复输入框。 |
| [CircularProgress](/lab/circular-progress) | 显示确定或不确定的圆环进度。 |
| [DiffViewer](/lab/diff-viewer) | 展示单个文件的统一或分栏 diff。 |
| [InfoTip](/lab/info-tip) | 为术语和指标提供补充解释。 |
| [LogStream](/lab/log-stream) | 展示可展开、可跟随的日志流。 |
| [Stat](/lab/stat) | 展示关键指标及趋势。 |
| [SVGIcon](/lab/svg-icon) | 按路径角色渲染多变体 SVG 图标。 |
| [EmojiPicker](/lab/emoji-picker) | 按分组搜索全部表情并选中，可内嵌或放进弹出层。 |
| [ChatEmojiPicker](/lab/chat-emoji-picker) | 在弹出层里按短名过滤并选择表情。 |
| [ChatReactionBar](/lab/chat-reaction-bar) | 在消息下展示表情回应，并可继续添加。 |
| [Schedule](/lab/schedule) | 按月、周、日或列表展示日程。 |

这些页面中的示例都可以直接交互，代码标签页提供完整 Vue 示例。
