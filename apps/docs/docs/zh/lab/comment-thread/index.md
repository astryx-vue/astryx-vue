---
title: CommentThread
---

# CommentThread

单独呈现的一个评论线程：首条评论、一级回复、表情回应、编辑历史，以及回复输入框。适用于文档旁的边注、高亮下方的弹出层，或任何只显示单个线程的界面。

这是 Meta Astryx 实验室 `CommentThread` 的 Vue 移植，对齐 v0.7.13。回复和编辑复用 `CommentComposerBase`，其中的表情按钮复用独立的 `EmojiPicker`。`Comments` 和 `CommentPin` 还不在这一刀里。

<script setup lang="ts">
import { labCommentThread } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labCommentThread" description="卡片里的边注：线程自带内边距，且不绘制外框线。点击表面会展开回复和回复输入框。标为已解决会弱化正文并出现“重新打开”。" locale="zh-CN" title="边注评论" /></ClientOnly>

此组件在 `@astryx-vue/lab` 中发布，只通过 `canary` 标签发布。

## 导入

```ts
import { CommentThread, DEFAULT_COMMENT_REACTIONS } from '@astryx-vue/lab'
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `comment` | `CommentThreadData` | — | 线程：首条评论，携带回复、可选引用段落和 `typingUsers`。 |
| `isSelected` | `boolean` | — | 受控的展开状态。省略时由线程自行管理选中。宿主控制的选中会展开正文和回复，但不会移动焦点或打开输入框。 |
| `currentUser` | `CommentUser` | — | 查看者，用于本人评论的操作和回复头像。 |
| `mode` | `'interactive' \| 'non-editable' \| 'read-only'` | `'interactive'` | 显示哪些操作。 |
| `container` | `'section' \| 'card'` | `'section'` | 页面上的描边 Card，或卡片、弹出层中不带外框线的 Section。 |
| `onSubmit` | `(content: string, parentCommentId?: string) => void \| Promise<void>` | — | 发布回复，父级始终是首条评论。被拒绝的 Promise 会恢复草稿并显示重试。 |
| `onSaveEdit` / `onDelete` / `onReact` | 函数 | — | 编辑、删除（先确认）和切换表情回应。 |
| `onResolveThread` / `onReopenThread` | 函数 | — | 标为已解决，或重新打开。 |
| `onRetryComment` | `(commentId: string) => void \| Promise<void>` | — | 为 `status` 为 `error` 的评论重试。 |
| `loadVersions` | `(commentId: string) => Promise<readonly CommentVersion[]>` | — | 加载编辑历史，最新的在前。 |
| `onUploadImages` | `CommentImageUploader` | — | 上传回复或编辑输入框中的图片。 |
| `onComposerDraftChange` | `(value: string, context: CommentComposerContext) => void` | — | 报告线程内部管理的回复和编辑草稿。 |
| `isSubmitting` | `boolean` | `false` | 宿主控制的回复输入框等待状态。 |
| `composerPlaceholder` | `string` | 本地化的“回复 \<name\>…” | 回复输入框的占位文字。 |
| `highlightColor` | `CommentHighlightColor` | `'yellow'` | 引用段落竖线的调色板颜色。 |
| `reactionOptions` | `readonly CommentReactionOption[]` | `DEFAULT_COMMENT_REACTIONS` | “添加回应”提供的选项。 |
| `agentCommands` / `composerTriggers` | 数组 | — | 斜杠命令和联想触发器。 |
| `hasEmojiPicker` | `boolean` | `true` | 输入框是否提供表情选择器。 |
| `onDismiss` | `() => void` | — | 把锚定宿主的轻触关闭交给线程。也可使用 `@dismiss`。请在宿主 Popover 上同时设置 `hasLightDismiss={false}` 和 `hasEscapeDismiss={false}`。 |

`CommentThreadData` 在 `CommentData` 之上增加 `replies`、`anchor`、`isResolved`、`resolvedBy`、`typingUsers`、`isHighlighted` 和 `canResolve`。

## 事件

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `selected-change` | `isSelected: boolean` | 查看者展开或收起线程。 |
| `dismiss` | — | 在线程外按下，或没有内层处理的 Escape，请求关闭。若有未保存草稿，第一次会抖动线程、把焦点移回草稿并播报。 |

## 插槽

| 名称 | 说明 |
| --- | --- |
| `anchor` / `body` / `versionBody` / `additionalActions` / `composer` | 与 `render*` 回调角色相同：替换引用、正文、历史版本、标题栏操作或输入区域。`render*` 属性仍然可用。 |

## 键盘与关闭

点击表面会展开线程；指针点击还会打开回复输入框。键盘激活会把焦点留在隐藏的线程切换按钮上，以便用同一个键再关闭。传入 `onDismiss` 后，只有当线程内没有打开的图层时，Escape 才会关闭线程。未保存的回复或编辑会把第一次关闭改成抖动、移回焦点和礼貌播报；紧接着的下一次才会关闭。在 `prefers-reduced-motion: reduce` 下不会抖动，焦点和播报仍然保留。
