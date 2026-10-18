---
layout: component-docs
title: 导航图标
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { navIconBasic } from '../../../../components/demos/nav-icon'
</script>

## 使用方法

`NavIcon` 是一个圆形底、带强调色的图标容器。放在 `TopNavHeading`、`PageNavHeader` 这类导航标题里，让人一眼认出这是哪个分区或哪个应用。

```ts
import { NavIcon } from '@astryx-vue/core/NavItem'
```

图标可以用 `iconClass` 传一个 CSS 图标类，也可以把图标元素直接放进默认插槽。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 放在导航标题里，给这个分区一个认得出的视觉锚点。 |
| <Badge variant="success">推荐</Badge> | 传 `Icon`，或尺寸接近的图标组件，比例才不会变形。 |
| <Badge variant="error">避免</Badge> | 别拿 `NavIcon` 当按钮用。它只是展示用的容器。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="navIconBasic" description="包着语义图标的圆形底容器。可以当标志，也可以当前导航标题里的强调图标。" locale="zh" title="基本用法" />
