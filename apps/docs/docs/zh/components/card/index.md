---
layout: component-docs
title: 卡片
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { cardCallout, cardElevation, cardLayout, cardSimple, cardVariants } from '../../../../components/demos/card'
</script>

## 使用方法

`Card` 是一块带边框、带背景和圆角的容器，用来把一组内容圈成一个可以独立对待的整体。它的职责只有外观和空间：背景、边框、圆角、内边距，以及把这个内边距告诉需要向外延伸的子元素。

卡片不是默认的排版工具。页面上的大多数内容分组并不需要容器，间距和对齐本身就能形成分组；只有当一个条目需要清晰的交互边界，或者需要在一行、一个网格里与同类条目并排比较时，才值得用卡片。一个好用的判断是问自己：“这一块我能单独把它排序、删除或拿走吗？”如果答案是能，它是卡片；如果答案是不能，它只是页面的一段，用标题加 `Stack` 就够了。

```vue
<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card>
    <VStack :gap="2">
      <Heading :level="3">
        Weekly report
      </Heading>
      <Text color="secondary">
        Your team closed 24 issues this week.
      </Text>
    </VStack>
  </Card>
</template>
```

`padding` 使用间距比例（0、0.5、1、1.5、2、3、4、5、6、8、10），作用于四边。省略它时，卡片用的是主题的卡片内边距，而不是某个固定步进值；也就是说，传一个步进值意味着你要覆盖主题，而不是复述默认值。

`variant` 决定背景：`default` 是标准的卡片表面并带一条可见的描边，`transparent` 既没有背景也没有描边（只用来做分组，不增加视觉重量），`muted` 使用弱化的背景色。其余十个名字是分类用的色相：`blue`、`cyan`、`gray`、`green`、`orange`、`pink`、`purple`、`red`、`teal`、`yellow`。只有 `default` 会画描边，而且描边画在内边距之内——它的宽度会从每一侧的内边距里减去，所以“描边 + 内边距”的总内缩仍然等于那个间距步进值，有边框的卡片和没有边框的卡片里，内容的坐标是一致的。

`elevation` 是静止时的阴影深度，可取 `none`、`low`、`med`、`high`。只有在卡片确实需要浮在周围内容之上时才抬升它；一个铺满列表的界面里每张卡片都带阴影，就失去了层次的意义。

`width`、`height`、`maxWidth`、`minHeight` 控制尺寸，数字按像素解释，字符串按原样使用。卡片在弹性行或网格轨道里会让位给轨道：它有一个为零的最小宽度，所以一行或一条 `1fr` 轨道不会被一张卡片里的长内容撑宽。同时卡片用 `overflow: clip` 裁掉自己装不下的内容，而不是变成滚动容器——那样会让卡片内部的粘性元素粘到卡片上，也会让溢出的卡片变成一个没有名字的键盘停靠点。因此，无法换行的长文本（长 ID、哈希、URL）请交给 `Text` 的 `maxLines` 去截断，宽内容（表格、代码）请让它自己带滚动区域。给卡片一个固定的 `height` 时行为会变：这张卡片就是你为内容指定的视口，内容在卡片内部滚动。

卡片还会在根元素上发布 `--container-padding-inline-start`、`--container-padding-inline-end`、`--container-padding-block-start`、`--container-padding-block-end`。需要向外延伸到卡片边缘的子元素（例如 `isFullBleed` 的 `Divider`）读取这几个变量来抵消内边距，所以它不需要知道卡片用了多少 padding。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 先问“这一块能单独排序或删除吗”。能，才是卡片；不能，就只是页面的一段，用标题加 `Stack` 或 `Section`。 |
| <Badge variant="success">推荐</Badge> | 用卡片承载离散的条目：一个用户、一条通知、一个指标、网格里的一个商品，每张卡片对应一个“东西”。 |
| <Badge variant="success">推荐</Badge> | 让同一组卡片的 `padding` 保持一致，这样它们在网格或列表里才会对齐。 |
| <Badge variant="success">推荐</Badge> | 长 ID、哈希、URL 用 `Text` 的 `maxLines="1"` 截断；表格、代码这类宽内容放进它自己的滚动区域。 |
| <Badge variant="success">推荐</Badge> | 只在卡片需要浮在内容之上时设置 `elevation`。 |
| <Badge variant="error">避免</Badge> | 把卡片当成默认的视觉分组手段。标题加 `Stack` 的间距就能建立层次，铺满描边只会让页面变吵。 |
| <Badge variant="error">避免</Badge> | 把页面区域包进卡片。“通用设置”“通知偏好”这类表单分组属于页面区域，不是卡片。 |
| <Badge variant="error">避免</Badge> | 在卡片里再放卡片。层次应该靠间距和分隔线压平，而不是叠盒子。 |
| <Badge variant="error">避免</Badge> | 用颜色变体表达状态。状态请交给 `Banner` 或 `Badge`，彩色卡片只用来分类。 |

## 示例

<DemoExample
  :demo="cardCallout"
  description="muted 变体适合提示、备注或补充信息。内容需要和页面区分开，但又不该太抢眼时使用。"
  locale="zh"
  title="提示卡片"
/>

<DemoExample
  :demo="cardElevation"
  description="四种海拔并排。卡片默认是平的；只有需要浮在周围内容之上时才用 elevation 抬起。"
  locale="zh"
  title="海拔"
/>

<DemoExample
  :demo="cardVariants"
  description="默认、muted 和颜色变体并排。用颜色给卡片分类，例如团队色、项目标签或内容类型。"
  locale="zh"
  title="变体"
/>

<DemoExample
  :demo="cardLayout"
  description="带结构化页眉、内容区和操作页脚的卡片。适合需要清晰分区的表单、对话框或设置面板。"
  locale="zh"
  title="布局"
/>

<DemoExample
  :demo="cardSimple"
  description="带标题和正文的卡片。适合摘要、说明，或任何需要从页面上分开的一组内容。"
  locale="zh"
  title="简单"
/>
