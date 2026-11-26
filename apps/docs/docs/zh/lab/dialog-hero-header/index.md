---
title: DialogHeroHeader
---

# DialogHeroHeader

给 `Dialog` 用的大图式页头：标题上方是铺满边缘的媒体，关闭按钮浮在媒体的右上角（从右到左时在左上角）。它是 `DialogHeader` 的醒目版，适合推荐、营销或新手引导类对话框。和 `DialogHeader` 一样放在 `Dialog` 里 `Layout` 的 header 插槽中。媒体用负边距抵掉页头内边距，铺到对话框边缘；标题给对话框命名。看得见的标题是对话框打开后的默认焦点；内联对话框和隐藏的标题不移动焦点。属于 Lab，只通过 `canary` 标签发布。

<script setup lang="ts">
import { labDialogHeroHeader } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labDialogHeroHeader" description="一个新手引导对话框：标题上方是深色媒体，关闭按钮浮在媒体上。" locale="zh" title="新手引导对话框" /></ClientOnly>

## 引入

```ts
import { DialogHeroHeader } from '@astryx-vue/lab'
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 对话框标题，包成二级标题。对话框没有自己的标签时，用它命名。要自定义标题，用 `title` 插槽。 |
| `mediaMode` | `'light' \| 'dark'` | `undefined` | 媒体的明暗。设了会给关闭按钮套一层 `MediaTheme`：深色媒体上按钮变浅，浅色媒体上变深。不设就沿用周围主题的颜色。 |
| `isTitleHidden` | `boolean` | `false` | 视觉上隐藏标题行，读屏软件仍能读到，对话框仍有名称。 |
| `maxLines` | `number` | `undefined` | 字符串标题最多显示几行，超出用省略号截断。 |
| `hasDivider` | `boolean` | `undefined` | 底边加一条分隔线。不设时用外层 Layout 的默认值。 |

## 事件

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `openChange` | `false` | 按下关闭按钮时触发。没有监听时不画关闭按钮，和 `DialogHeader` 一样。 |

## 插槽

| 名称 | 说明 |
| --- | --- |
| `media` | 标题上方铺满边缘的视觉内容：图片、插画或图标。尺寸自己设，比如 `width: 100%`。 |
| `startContent` | 标题前的内容，比如图标。不算进对话框的名称。 |
| `title` | 自定义标题。对话框的标题 id 和默认焦点会加到渲染出来的标题元素本身上；你自己写了 `id` 时保留你的，这时请用 `aria-labelledby` 给对话框命名。 |

## 最佳实践

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 按媒体的明暗设置 `mediaMode`，关闭按钮才看得清：深色图片用 `mediaMode="dark"`。 |
| <Badge variant="success">推荐</Badge> | 操作按钮放在 `LayoutFooter`；大图页头不放操作。 |
| <Badge variant="success">推荐</Badge> | 媒体已经把意思说清楚时用 `isTitleHidden`，标题仍然给读屏软件命名对话框。 |
| <Badge variant="error">避免</Badge> | 用在普通的确认框或表单里；那些用紧凑的 `DialogHeader`。 |
| <Badge variant="error">避免</Badge> | 装饰图片不写空 `alt`；纯装饰的图片写 `alt=""`，读屏软件会跳过。 |
