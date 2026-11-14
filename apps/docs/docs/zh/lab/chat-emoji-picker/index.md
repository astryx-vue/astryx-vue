---
title: ChatEmojiPicker
---

# ChatEmojiPicker

在触发按钮上打开一个弹出层，用短名过滤表情，方向键在 8 列网格里移动焦点。选中后发出 `select`，弹出层关闭，焦点回到触发按钮。

<script setup lang="ts">
import { labChatEmojiPicker } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labChatEmojiPicker" description="点按钮打开选择器，输入短名过滤，选中的表情显示在旁边。" locale="zh" title="基本用法" /></ClientOnly>

这个组件属于 `@astryx-vue/lab`，只通过 `canary` 标签发布。

## 导入

```ts
import { ChatEmojiPicker, DEFAULT_CHAT_EMOJIS } from '@astryx-vue/lab'
```

`DEFAULT_CHAT_EMOJIS` 是内置的 16 个常用回应。传入 `emojis` 可以换成自己的一组。

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `emojis` | `readonly { emoji: string; name: string }[]` | `DEFAULT_CHAT_EMOJIS` | 网格中的表情。`name` 用于过滤和按钮的无障碍名。 |
| `label` | `string` | `'Pick an emoji'` | 弹出层对话框的无障碍名。 |
| `searchLabel` | `string` | 文案键 `@astryx.emojiPicker.searchLabel` | 过滤框的占位符和隐藏标签。 |

## 事件

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `select` | `emoji: string` | 选中的表情。弹出层随后关闭，过滤词清空。 |

## 插槽

默认插槽是触发内容，里面要有一个 `<button>`。弹出层会把点击和 `aria-expanded` 接到这个按钮上。

过滤框、网格标题和“没有匹配”的句子走 `@astryx.emojiPicker.*`。若需要按 CLDR 分组的完整选择器（常用表情、关键词搜索和预览栏），请使用 [EmojiPicker](/lab/emoji-picker)，不要把这个聊天选择器改名充数。
