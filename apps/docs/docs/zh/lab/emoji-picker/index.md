---
title: EmojiPicker
---

# EmojiPicker

独立的表情面板：上面是搜索框，下面按分组列出全部表情，常用表情排在最前。可以内嵌，也可以放进弹出层。选中后发出 `select`。选择器自己不保留选中态。

这是 Meta Astryx 实验室 `EmojiPicker` 的 Vue 移植，不是把现有 `ChatEmojiPicker` 改个名。`ChatEmojiPicker` 仍然是聊天里那一组短而固定的回应表情弹出层；`EmojiPicker` 会加载内置的 CLDR 分组（或你传入的分组），支持常用表情、关键词搜索、预览栏，以及跨所有分组共用的一个 Tab 落脚点。后续的 `CommentComposer` 会复用这个面板。

<script setup lang="ts">
import { labEmojiPicker, labEmojiPickerPopover } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labEmojiPicker" description="在卡片里内嵌选择器。按名称或关键词过滤，选中的表情显示在下方。" locale="zh" title="内嵌选择器" /></ClientOnly>

<ClientOnly><DemoExample :demo="labEmojiPickerPopover" description="从按钮打开弹出层里的选择器。弹出层的自动聚焦会落到搜索框。" locale="zh" title="在弹出层里" /></ClientOnly>

这个组件属于 `@astryx-vue/lab`，只通过 `canary` 标签发布。

## 导入

```ts
import { DEFAULT_FREQUENT_EMOJIS, EmojiPicker } from '@astryx-vue/lab'
```

不传 `categories` 时，第一次挂载会加载内置集：Emoji 15 以内的全部表情，带英文 CLDR 名称，数据对齐 Meta Astryx v0.7.13（由 emojibase-data 17.0.0 生成）。要本地化或自定义时，传入自己的 `categories` 和 `frequentEmojis`。`frequentEmojis` 传空数组则不显示「常用」这一行。

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `frequentEmojis` | `readonly EmojiOption[]` | `DEFAULT_FREQUENT_EMOJIS` | 列在最前面、出现在「常用」下面的表情。空数组则不显示这一行。 |
| `categories` | `readonly EmojiCategory[]` | 内置集 | 按组分好的表情。不传则加载内置集。 |
| `height` | `number \| string` | `'calc(var(--astryx-spacing-8, 32px) * 10)'` | 可滚动表情列表的高度。 |
| `hasAutoFocus` | `boolean` | `false` | 挂载时聚焦搜索框，适合内嵌或放在对话框里。放在弹出层里时应改用弹出层自己的自动聚焦。 |
| `label` | `string` | 文案键 `@astryx.emojiPicker.label` | 表情列表的无障碍名称。没有悬停或聚焦的表情时，预览栏也用这句话。 |
| `searchLabel` | `string` | 文案键 `@astryx.emojiPicker.searchLabel` | 搜索框的占位符和隐藏标签。 |

`EmojiOption` 是 `{ emoji: string; name: string; keywords?: readonly string[] }`。`EmojiCategory` 是 `{ name: string; emojis: readonly EmojiOption[] }`。

## 事件

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `select` | `emoji: string, option: EmojiOption` | 选中的表情字符和对应的选项。 |

## 键盘与文案

每个分组是以标题命名的 WAI-ARIA 网格，每行 8 个格子。整张选择器只有一个 Tab 落脚点：从搜索框按 Tab 落到它，再按一次 Tab 离开选择器。方向键按布局移动，Home / End 走到行首行尾，Ctrl+Home / Ctrl+End 跳到第一个和最后一个表情，Enter 选中当前表情。搜索框里按 Down 进入第一个表情，第一行再按 Up 回到搜索框。搜索框里按 Enter 选中第一条匹配。输入法正在组字时，Enter 和方向键留给候选框。

过滤框、分组标题、加载中、加载失败和没有匹配的句子走 `@astryx.emojiPicker.*`。内置分组标题会翻译；内置表情的名称本身仍是英文 CLDR，其他语言请传入本地化的 `categories`。
