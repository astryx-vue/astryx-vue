---
title: Comments
---

# Comments

某一条目上的评论：带一级回复的评论线程、表情回应、编辑历史、行内引用和动态事件，以及用于发布新评论的输入框。宿主拥有数据和每一次变更；面板负责呈现、选中和焦点。

这是 Meta Astryx 实验室 `Comments` 的 Vue 移植，对齐 v0.7.13。每个线程复用 `CommentThread` / `CommentRow`，新评论、回复和编辑复用 `CommentComposerBase`，其中的表情按钮复用独立的 `EmojiPicker`。`CommentPin` 还不在这一刀里。

<script setup lang="ts">
import { labComments } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labComments" description="评论面板：线程、动态事件、可加载的更早评论、发送失败的评论、智能体正在撰写的回复，以及新评论输入框。点击线程可展开回复。标为已解决会弱化正文并出现“重新打开”。" locale="zh-CN" title="评论面板" /></ClientOnly>

此组件在 `@astryx-vue/lab` 中发布，只通过 `canary` 标签发布。

## 导入

```ts
import { Comments, DEFAULT_COMMENT_REACTIONS } from '@astryx-vue/lab'
```

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `comments` | `readonly CommentThreadData[]` | — | 受控的线程列表。与 `events` 按时间交错显示；默认从早到晚，只有当列表本身是从晚到早时才倒序。 |
| `events` | `readonly CommentActivityEvent[]` | `[]` | 条目上的动态，按时间插入线程之间。 |
| `label` | `string` | 本地化的「Comments」 | 评论区域的无障碍名称。 |
| `composerPosition` | `'top' \| 'bottom' \| 'none'` | `'bottom'` | 新评论输入框的位置。 |
| `density` | `'compact' \| 'balanced'` | `'balanced'` | 列表和停靠区的间距。 |
| `layout` | `'pane' \| 'embedded'` | `'pane'` | `pane` 填满容器并滚动，输入框停靠在底部。`embedded` 按内容高度嵌入宿主的 Card 或 Popover：没有滚动区或停靠区；在卡片父级中，第一条线程上方和最后一条线程下方不绘制分隔线。 |
| `selectedThreadId` | `string \| null` | — | 由宿主控制的选中线程，用于和高亮同步。省略则由面板自己管理选中。宿主选中会展开正文和回复，但不会移动焦点或打开回复输入框。 |
| `currentUser` | `CommentUser` | — | 当前查看者，用于自己的评论操作和输入框头像。 |
| `mode` | `'interactive' \| 'non-editable' \| 'read-only'` | `'interactive'` | 显示哪些操作。 |
| `container` | `'section' \| 'card'` | `'section'` | 线程显示为描边卡片，或作为卡片/弹出层内带分隔线的 Section。 |
| `composerAnchor` | `CommentAnchor` | — | 新评论将附着的段落，输入框会引用它。面板挂载时就有的引用不会抢焦点；之后才到达的引用会聚焦输入框。 |
| `onComposerAnchorDismiss` | `() => void` | — | 在引用段落上增加“移除引用”。 |
| `isLoading` | `boolean` | `false` | 用评论形状的占位符代替线程；若本应显示输入框，同时显示输入框形状的占位符。 |
| `loadError` | `string` | — | 显示错误 Banner，标题为本地化的「Comments couldn't load」。传入 `onRetryLoad` 时带有重试操作。通过共享播报通道断言式播报一次；Banner 本身没有 live 角色。 |
| `hasOlderComments` / `isLoadingOlder` / `onLoadOlder` | boolean / boolean / function | `false` / `false` / — | 在线程上方加载更早的评论。失败时按钮会换成“重试”，焦点跟着走。 |
| `onSubmit` | `(content: string, parentCommentId?: string) => void \| Promise<void>` | — | 发布新评论，或在传入父评论时发布回复。Promise 被拒绝时会恢复草稿。 |
| `onSaveEdit` / `onDelete` / `onReact` | function | — | 编辑、删除（先确认）和切换表情回应。 |
| `onResolveThread` / `onReopenThread` | function | — | 标为已解决，或重新打开。 |
| `onRetryComment` | `(commentId: string) => void \| Promise<void>` | — | 重试 `status` 为 `error` 的评论。 |
| `loadVersions` | `(commentId: string) => Promise<readonly CommentVersion[]>` | — | 加载编辑历史，最新的在前。 |
| `onUploadImages` | `CommentImageUploader` | — | 在任意输入框中上传图片。 |
| `composerError` | `string` | — | 宿主提供的新评论输入框错误。 |
| `emptyState` | `VNode` | 默认空状态 | 替换默认的无评论状态。也可使用 `emptyState` 插槽。 |
| `renderEvent` | `(event: CommentActivityEvent) => VNode` | 默认动态行 | 替换默认的动态事件行。也可使用 `event` 插槽。 |
| `isSubmitting` | `boolean` | `false` | 由宿主控制的输入框提交中状态。 |
| `composerPlaceholder` | `string` | 本地化的「Write a comment…」 | 新评论输入框的占位符。 |
| `highlightColor` | `CommentHighlightColor` | `'yellow'` | 引用段落的色板颜色。 |
| `reactionOptions` | `readonly CommentReactionOption[]` | `DEFAULT_COMMENT_REACTIONS` | “添加回应”提供的表情。 |
| `hasEmojiPicker` | `boolean` | `true` | 输入框是否提供表情选择器。 |

与线程共享的回调（`onComposerDraftChange`、`getReplyMention`、`agentCommands`、`composerTriggers` 以及各 `render*` 属性）含义与 `CommentThread` 相同。

## 事件

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `selected-thread-change` | `threadId: string \| null` | 查看者选中了一个线程，或取消了当前选中。 |

## 插槽

| 名称 | 说明 |
| --- | --- |
| `emptyState` | 替换默认的无评论状态。 |
| `event` | 替换默认的动态事件行。 |
| `composer` | 替换新评论输入区域，渲染参数与 `renderComposer` 相同。 |
| `composerControls` | 附件和表情按钮之后、由产品提供的控件。请保持为单个简短控件。 |

## 布局

为 `pane` 提供明确的高度；面板会填满该容器，列表滚动，底部输入框停靠在下方。`embedded` 面板和线程、输入框一样高，适合放在 Card 或 Popover 里。在卡片父级中，第一条和最后一条线程会去掉外侧分隔线，避免卡片再套一层卡片。
