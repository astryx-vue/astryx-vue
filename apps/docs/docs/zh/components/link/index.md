---
layout: component-docs
title: 链接
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { linkExternal, linkInline, linkTooltips } from '../../../../components/demos/link'
</script>

## 使用方法

`Link` 用于在应用内部或外部之间建立导航。它默认渲染为 `<a>`，当没有 `href` 时会降级为 `<button>`，方便在需要链接样式但触发操作的场景中使用。从独立入口导入后，结构样式会随组件自动加载：

```vue
<script setup lang="ts">
import { Link } from '@astryx-vue/core/Link'
</script>

<template>
  <Link href="/docs">
    文档
  </Link>
  <Link href="https://github.com" is-external-link>
    GitHub
  </Link>
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 链接文字应直接描述目标，例如“查看文档”“联系我们”，避免使用“点击这里”这类含糊表达。 |
| <Badge variant="success">推荐</Badge> | 跳转到站外的链接使用 `isExternalLink`，组件会自动添加 `target="_blank"` 和 `rel="noopener noreferrer"`，并给出外部标识。 |
| <Badge variant="success">推荐</Badge> | 在一组链接或长段落中，使用 `color="secondary"` 降低视觉噪音，让真正的重点操作更突出。 |
| <Badge variant="error">避免</Badge> | 避免把页面上的大量文字都做成链接：过多的下划线或强调色会削弱链接本身的可发现性。 |
| <Badge variant="error">避免</Badge> | 避免把关键操作只做成链接。保存、删除、提交等核心操作应使用 `Button`，让用户明确感知这是一个动作。 |

## 示例

<DemoExample
  :demo="linkExternal"
  description="isExternalLink 在新标签页打开，并带上外部标识。需要下划线时再加 hasUnderline。"
  locale="zh"
  title="外部链接"
/>

<DemoExample
  :demo="linkInline"
  description="链接嵌在一段正文里，跟前后的文字排在同一行。"
  locale="zh"
  title="行内链接"
/>

<DemoExample
  :demo="linkTooltips"
  description="悬停或聚焦时，Tooltip 说明这个链接会去哪里。"
  locale="zh"
  title="提示"
/>
