---
layout: component-docs
title: 居中容器
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { centerHorizontal, centerInsideCard } from '../../../../components/demos/center'
</script>

## 使用方法

`Center` 把内容放进一个弹性容器，并沿一条轴或两条轴把它居中。它只做布局：自己不上色、不画边框，也不给内容附加任何角色或名称，因此空状态、加载页、登录表单这类"内容需要在可用空间里居中"的场景都可以直接使用。

默认同时在两条轴上居中：

```vue
<script setup lang="ts">
import { Center } from '@astryx-vue/core/Center'
</script>

<template>
  <Center :height="200">
    <p>这里还没有内容</p>
  </Center>
</template>
```

插槽里的内容被当作一个整体居中，`Center` 不会在多个子元素之间分配间距。需要沿某个方向排列多项时，请改用 `Stack`。

`axis` 决定居中哪条轴。`both`（默认值）同时居中主轴与交叉轴，`horizontal` 只居中行内方向，`vertical` 只居中块方向。后两个取值是按横向书写命名的：它们最终落在 flex 的对齐属性上，所以在纵向书写下跟随的是 flex 主轴与交叉轴。单轴居中只有在对应方向上有可分配的空间时才看得出效果，因此 `both` 和 `vertical` 通常需要给出 `height`，否则容器只有内容那么高，视觉上和没有居中一样。

```vue
<script setup lang="ts">
import { Center } from '@astryx-vue/core/Center'
import { Spinner } from '@astryx-vue/core/Spinner'
</script>

<template>
  <Center axis="vertical" :height="240">
    <Spinner />
  </Center>
</template>
```

容器自身的尺寸由 `width`、`height`、`maxWidth`、`minHeight` 控制。数字按像素处理，字符串按原样作为 CSS 值使用，例如 `width="100%"` 或 `maxWidth="70rem"`。内边距沿用与 `Stack` 相同的间距刻度：`padding` 设置四边，`paddingInline`、`paddingBlock` 覆盖各自的轴，`paddingInlineStart`、`paddingInlineEnd`、`paddingBlockStart`、`paddingBlockEnd` 再覆盖单条边。越具体的那一层生效，`0` 同样是有效取值，可以显式清掉上一层设置的内边距。

`isInline` 会把容器换成 `inline-flex`。这时它作为行内元素参与文字排版，不会打断行盒，适合给图标或角标做一个固定大小的小方块。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 只在横向书写的界面里使用单轴取值，或者确认当前书写模式后再用。纵向书写时单轴取值跟随的是 flex 主轴与交叉轴，而不是属性名的字面含义。 |
| <Badge variant="success">推荐</Badge> | 在横向书写下用 `axis="vertical"` 或默认的 `both` 时给出 `height`。居中需要有可分配的空间，容器只有内容那么高时看不出任何变化。 |
| <Badge variant="success">推荐</Badge> | 行内的小元素（图标、角标）用 `isInline` 居中，这样它仍然属于当前行，文字排版不会被拆断。 |
| <Badge variant="success">推荐</Badge> | 把语义结构和无障碍名称留在内容上。`Center` 是纯布局容器，不会添加角色或标签，内容自己负责这些信息。 |
| <Badge variant="error">避免</Badge> | 用 `Center` 承担整页结构。页面骨架应该由外层布局决定，`Center` 只解决一块内容的居中。 |
| <Badge variant="error">避免</Badge> | 用 `Center` 横向排列表格、列表等多项内容。多项排列用 `Stack` 配合 `hAlign="center"` 更直接。 |

## 示例

<DemoExample :demo="centerHorizontal" description="一组格式按钮沿水平轴居中。在竖排书写里，这条轴跟着 flex 主轴走，并不保证物理上的水平居中。" locale="zh" title="水平居中" />

<DemoExample :demo="centerInsideCard" description="空状态在固定高度的卡片里同时水平和垂直居中。高度决定了可以分配的居中空间。" locale="zh" title="卡片内部" />
