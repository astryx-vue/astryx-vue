---
layout: component-docs
title: 列表
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { listBasic, listBulleted, listMessages, listSteps } from '../../../../components/demos/list'
</script>

## 使用方法

`List` 用来呈现一组彼此相关的条目，`ListItem` 是其中的一行。它渲染出语义正确的 `<ul>` 或 `<ol>`，并统一安排一行内部「起始内容 + 标签 + 描述 + 结束内容」四块位置，所以设置项、通知、步骤说明这类界面不必每次都重新写一遍行布局。

一行最少只需要一个 `label`：

```vue
<script setup lang="ts">
import { List, ListItem } from '@astryx-vue/core/List'
</script>

<template>
  <List header="Inbox">
    <ListItem label="Mentions" description="Comments that name you" />
    <ListItem label="Build finished" description="main passed every check" />
  </List>
</template>
```

`description` 是标签下方的次要文字。使用 `startContent` 和 `endContent` 两个插槽可以把图标、头像、徽章或操作按钮放在行的两端；`label` 和 `description` 也各有一个同名插槽，当文字需要用富文本表达时改用它即可。

列表的密度由 `List` 的 `density` 统一决定，单行可以用 `ListItem` 的 `density` 覆盖它。`compact` 对应 4 像素的上下内边距，`balanced` 是默认的 8 像素，`spacious` 是 12 像素并把左右内边距也放宽一档。`hasDividers` 会在相邻两行之间画一条分隔线，最后一行不会画。

`listStyle` 决定每行前面画什么标记：`disc` 是实心圆点，`circle` 是空心圆点，`decimal` 会改用 `<ol>` 渲染并给出序号，`start` 用来指定序号从几开始。不需要标记时保持默认的 `none`。

一行可以通过两种方式变成可交互。给出 `onClick` 之后，行内部会出现一个占满内容区的按钮，键盘用户可以用 Tab 聚焦它、用回车或空格触发；给出 `href` 时同一位置会变成链接，`target="_blank"` 会自动补上 `noopener` 和 `noreferrer`。点击行内的其他控件（例如 `endContent` 里的按钮）不会触发这一行自己的动作。

`isSelected` 把行标记为选中。如果这一行带有允许 `aria-selected` 的角色，例如 `option`、`tab` 或 `row`，状态会写进 `aria-selected`；否则会退回到在任何元素上都合法的 `aria-current="true"`，屏幕阅读器仍然能读到当前项。`isDisabled` 会让行变成惰性的，并把它的内容调淡。

`header` 插槽会在列表上方渲染一段标题，并用 `aria-labelledby` 与列表关联起来，于是屏幕阅读器在进入列表时会先读出这个标题。`edgeCompensation="inline"` 用于把列表放在带内边距的容器里时让每一行的文字与同级的标题对齐：它会按每个逻辑边缘各自可用的容器内边距，抵消掉行自身的左右内边距，最多抵消到零。

包里同时导出了更通用的原语 `Item`。`ListItem` 就是它在 `<li>` 上的一层封装，加上来自 `List` 的密度和标记；需要在非列表结构里复用同一套行布局时，可以直接使用 `Item`，它能通过 `as` 决定根元素，并提供 `align`、`labelLines`、`descriptionLines`、`layout` 等额外控制。大多数界面只需要 `List` 和 `ListItem`。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用 `header` 给列表一个标题。屏幕阅读器进入列表时会先读出它，用户也能立刻知道这组内容是什么。 |
| <Badge variant="success">推荐</Badge> | 用 `startContent` 和 `endContent` 放置图标、头像、徽章或时间戳，让行的两端承担分类和信息提示的作用。 |
| <Badge variant="success">推荐</Badge> | 需要区分当前项时使用 `isSelected`，让组件根据角色选择 `aria-selected` 或 `aria-current`，而不是自己写 ARIA 属性。 |
| <Badge variant="success">推荐</Badge> | 内容长度不定时给出 `descriptionLines`，或者让组件按默认的单行截断来裁剪字符串描述，避免行高随文字跳动。 |
| <Badge variant="error">避免</Badge> | 在可点击的行里再放一个可点击的控件作为主要操作。行的按钮已经占据整块内容区，两个点击目标会让焦点顺序和行为都变得难以预测。 |
| <Badge variant="error">避免</Badge> | 为单个条目使用列表。列表意味着这些内容属于同一组，条目太少时用普通的段落更自然。 |
| <Badge variant="error">避免</Badge> | 在同一个列表里混用可点击和不可点击的行而不作区分，用户会不知道哪些行可以打开。 |

## 示例

<DemoExample
  :demo="listBasic"
  description="带标签和说明的简单列表，适合设置类布局。"
  locale="zh"
  title="基本"
/>

<DemoExample
  :demo="listBulleted"
  description="用圆点标出功能要点。"
  locale="zh"
  title="项目符号"
/>

<DemoExample
  :demo="listMessages"
  description="聊天式消息列表，包含头像、预览文字和未读徽章。"
  locale="zh"
  title="消息列表"
/>

<DemoExample
  :demo="listSteps"
  description="用数字标出逐步说明。"
  locale="zh"
  title="有序步骤"
/>
