---
title: CommentComposer
---

# CommentComposer

评论输入框：上方是可长到五行的输入（支持 typeahead 触发符，以及粘贴或拖入图片），下方是添加图片、表情和 Post。它是受控的：草稿由宿主持有，评论发出后再由宿主清空。空草稿不会发出。

这是 Meta Astryx 实验室 `CommentComposer` 的 Vue 移植，对齐 v0.7.13（含后续焦点行为：禁用控件仍留在 Tab 顺序里，忙碌编辑器的 Cancel 链接保持 Tab 落脚点）。表情按钮复用独立的 `EmojiPicker`。`CommentThread`、`Comments` 和 `CommentPin` 不在这一刀里。

<script setup lang="ts">
import { labCommentComposer, labCommentComposerEdit } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labCommentComposer" description="带引用段落的受控输入框。发出后草稿会出现在上方列表里并被清空。也可以移除引用文字。" locale="zh" title="新评论" /></ClientOnly>

<ClientOnly><DemoExample :demo="labCommentComposerEdit" description="编辑上下文中的 CommentComposerBase。Cancel 链接在忙碌时仍留在 Tab 顺序里。" locale="zh" title="编辑评论" /></ClientOnly>

此组件在 `@astryx-vue/lab` 中，只通过 `canary` 标签发布。

## 导入

```ts
import { CommentComposer, CommentComposerBase } from '@astryx-vue/lab'
```

`CommentComposer` 是独立表面。之后的讨论串会用 `CommentComposerBase` 做回复和编辑。

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` / `modelValue` | `string` | `''` | 受控草稿。用 `value` + `@change` 或 `v-model` 绑定。 |
| `placeholder` | `string` | 文案 `@astryx.commentComposer.placeholder` | 输入框占位符。 |
| `label` | `string` | 占位符 | 输入框的无障碍名称。 |
| `isSubmitting` | `boolean` | `false` | 发出过程中按住添加图片和表情。输入框保持可用，以免焦点落到 `<body>`。Post 仍可聚焦，但会拒绝第二次按下。 |
| `error` | `string` | — | 在输入框上方显示错误 Banner。 |
| `anchor` | `CommentAnchor` | — | 新的行内评论所附着的段落，显示在输入框上方。 |
| `highlightColor` | `CommentHighlightColor` | `'yellow'` | 引用段落竖线的调色板颜色。 |
| `onUploadImages` | `(files: readonly File[]) => CommentUploadedImage[] \| Promise<...>` | — | 上传添加、粘贴或拖入的图片，并以 Markdown 追加到草稿。出现添加图片按钮。忙碌时不会开始上传。 |
| `triggers` | `readonly ChatComposerTrigger[]` | `[]` | Typeahead 触发符，例如用 `@` 搜索人员。 |
| `agentCommands` | `readonly CommentAgentCommand[]` | `[]` | 评论可以呼叫的智能体：输入 `/` 会列出它们。 |
| `hasEmojiPicker` | `boolean` | `true` | 是否显示表情按钮。 |

`CommentAnchor` 是 `{ quote: string; status?: 'anchored' \| 'orphaned' }`。`CommentUploadedImage` 是 `{ url: string; alt: string }`。`CommentHighlightColor` 是诸如 `'yellow'`、`'green'` 的调色板名。

## 事件

| 名称 | 载荷 | 说明 |
| --- | --- | --- |
| `change` / `update:modelValue` | `value: string` | 草稿发生了变化。 |
| `submit` | `value: string` | 按下 Enter 或 Post。空草稿不会发出。宿主应在评论发出后清空草稿。 |
| `retry` | — | 错误 Banner 上的重试。 |
| `anchor-dismiss` | — | 移除引用文字。 |

## 插槽

| 名称 | 说明 |
| --- | --- |
| `controls` | 添加图片和表情按钮之后、由产品自己放的控件。只放一个短控件：页脚不会换行。 |
| `composer` | 替换默认输入框，同时保留它的状态和上下文。 |

## 键盘与忙碌行为

输入框最多长到五行。Enter 发出，Shift+Enter 换行。输入法正在组字时，Enter 仍留给输入法。点输入框里的空白会聚焦输入，点到它自己的控件或它打开的浮层则不会。

`isSubmitting` 不会给输入框、文件选择、Cancel 或 Post 加上原生 `disabled`。添加图片和表情使用 `aria-disabled`，仍可聚焦。编辑上下文里的 Cancel 仍留在 Tab 顺序中，直到发出结束才响应。忙碌时会拒绝粘贴或拖入的图片，以及第二次 Post。
