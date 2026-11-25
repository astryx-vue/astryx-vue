---
title: LineClamp
---

# LineClamp

把任意内容截成固定行数，结尾带省略号。`Text` 的 `maxLines` 截的是一个 Text 元素；LineClamp 截它包住的任何内容，自己不加字体、颜色或换行样式，适合混合的行内内容和嵌套元素。

<script setup lang="ts">
import { labLineClamp } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labLineClamp" description="一段带加粗和链接的说明截成两行，悬停或用 Tab 聚焦可以看到全文。" locale="zh" title="基本用法" /></ClientOnly>

## 导入

```ts
import { LineClamp } from '@astryx-vue/lab'
```

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `maxLines` | `number` | 必填 | 截断前最多显示几行，超出部分以省略号结尾。 |
| `hasTruncateTooltip` | `boolean` | `true` | 截断时在悬停、轻点或键盘聚焦时用提示显示完整文字。截断的根元素会成为 Tab 停靠点（`tabindex="0"`）；你自己写的 `tabindex` 优先。提示等到第一次交互才挂载。 |
| `truncateTooltipPlacement` | `'above' \| 'below' \| 'start' \| 'end'` | `'above'` | 截断提示的位置。 |
| `as` | `'div' \| 'span' \| 'p'` | `'div'` | 渲染的元素。 |

## 插槽

| 名称 | 说明 |
| --- | --- |
| 默认插槽 | 要截断的内容：混合的行内内容、嵌套元素都可以。 |

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 截一段混合或组合出来的内容（不只是一个 Text）时用 LineClamp。 |
| <Badge variant="success">推荐</Badge> | 只截一个 Text 时，直接用 `Text` 的 `maxLines`，不必再包一层 LineClamp。 |
| <Badge variant="success">推荐</Badge> | 截断的内容在页面别处已经能看到时，用 `:has-truncate-tooltip="false"` 关掉提示，免得重复播报。 |

## 被裁掉的可聚焦元素

行数截断只裁绘制，不裁布局，被裁掉那几行里的链接本来仍在 Tab 顺序里。LineClamp 会把**完全落在最后一行可见行之外**、并且**在它自己文档流里**的可聚焦后代标成 `inert`，重新露出来时再还原：

- 只露出一部分的控件仍然可达。持有焦点的元素从不标 `inert`，焦点离开后再查。
- fixed 元素、包含块是 LineClamp 本身或在它外面的 absolute 元素、弹出层和对话框，以及嵌套的 LineClamp 里的元素，都不归它管。
- 它只加一个 `inert`，从不改写你自己的 `tabindex` 和 `aria-hidden`；你自己设了 `inert` 的元素保持你的设置。
- 尺寸、内容、换行（包括字体加载后重新换行）变化时都会重查。
