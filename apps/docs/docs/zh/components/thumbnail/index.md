---
layout: component-docs
title: 缩略图
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { thumbnailDisabled, thumbnailGallery, thumbnailRemovable, thumbnailStates } from '../../../../components/demos/thumbnail'
</script>

## 使用方法

`Thumbnail` 是 64px 的预览。没有 `src` 时是占位图。只有 `isLoading`、没有 `src` 时是骨架。两者都有时，图片上盖一层加载指示。监听 `click` 后，预览变成按钮。监听 `remove` 后，出现关闭按钮。

`showRemoveOn` 默认是 `hover`。键盘焦点时也会出现，粗指针设备上则一直可见。`always` 让它一直可见。`isDisabled` 会把缩略图调淡，并忽略点击和移除。

`label` 是无障碍名称，不会画在方块上。提示和移除按钮都会用到它。

```vue
<script setup lang="ts">
import { Thumbnail } from '@astryx-vue/core/Thumbnail'
</script>

<template>
  <Thumbnail src="/photo.jpg" alt="雪山" label="snowy-peaks.jpg" />
</template>
```

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | `alt` 写图片内容，`label` 写移除时能认出来的文件名。 |
| <Badge variant="success">推荐</Badge> | 指针可能很粗，或者移除是主要操作时，用 `showRemoveOn="always"`。 |
| <Badge variant="success">推荐</Badge> | 文件还没有预览时先放占位，有地址后再传 `src`。 |
| <Badge variant="error">避免</Badge> | 把文件名画进方块。提示里已经有 `label`。 |
| <Badge variant="error">避免</Badge> | 在 `isDisabled` 或 `isLoading` 时还指望 `click` 会触发。 |

## 示例

<DemoExample
  :demo="thumbnailDisabled"
  description="禁用后透明度降低，移除按钮和点击都不再响应。"
  locale="zh"
  title="Thumbnail — 禁用"
/>

<DemoExample
  :demo="thumbnailGallery"
  description="一排可点击的缩略图。适合附件列表：点开预览，点关闭移除。"
  locale="zh"
  title="Thumbnail — 图库"
/>

<DemoExample
  :demo="thumbnailRemovable"
  description="右上角的移除按钮在深色和浅色图片上都看得见。"
  locale="zh"
  title="Thumbnail — 可移除"
/>

<DemoExample
  :demo="thumbnailStates"
  description="占位、骨架、上传中和已加载并排，对应从空到完成的过程。"
  locale="zh"
  title="Thumbnail — 状态"
/>
