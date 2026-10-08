---
layout: component-docs
title: 头像
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { avatarSizes, avatarShapes, avatarFallback, avatarStatus } from '../../../../components/demos/avatar'
</script>

## 使用方法

`Avatar` 用于呈现用户的形象：有图片时显示图片，图片缺失或加载失败时回退到姓名首字母，两者都没有时显示默认的人物图标。它支持多种尺寸与形状，还可以通过状态点标示用户是否在线。

组件从独立入口导入，结构样式会随组件自动加载；主题在应用入口引入一次即可：

```ts
import '@astryx-vue/themes/neutral.css'
```

基本用法：

```vue
<script setup lang="ts">
import { Avatar, AvatarStatusDot } from '@astryx-vue/core/Avatar'
</script>

<template>
  <Avatar src="/user.jpg" name="John Doe" />
  <Avatar name="Jane Smith" size="xl" />
  <Avatar src="/user.jpg" name="John Doe">
    <template #status>
      <AvatarStatusDot variant="success" />
    </template>
  </Avatar>
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 始终通过 `name` 传入用户名：图片加载失败时它会生成首字母回退，也是屏幕阅读器朗读头像时使用的无障碍标签。 |
| <Badge variant="success">推荐</Badge> | 在列表、评论或聊天消息中，同一场景内的头像使用统一尺寸，错落的尺寸会打断视觉节奏。 |
| <Badge variant="success">推荐</Badge> | 用 `AvatarStatusDot` 标示用户在线、忙碌等状态，放进 `status` 插槽后会固定在头像角落。 |
| <Badge variant="success">推荐</Badge> | 当头像本身作为链接或按钮使用时，通过 `alt` 或 `name` 提供有意义的名称，使用屏幕阅读器的用户才能知道它指向谁。 |
| <Badge variant="error">避免</Badge> | 避免只用头像替代用户名。头像应与姓名或标签一起出现，用户才能快速分清彼此。 |
| <Badge variant="error">避免</Badge> | 避免使用分辨率过低的图片。头像通常会被裁切为圆形，低分辨率图片放大后容易模糊。 |

## 示例

<DemoExample
  :demo="avatarSizes"
  description="头像提供 xsm、sm、md、lg 等命名尺寸，也可以直接传入像素值，方便与设计稿精确对齐。"
  locale="zh"
  title="尺寸"
/>

<DemoExample
  :demo="avatarShapes"
  description="头像有圆形、圆角方形和方形三种形状，默认为圆形，可按内容类型和页面风格选择。"
  locale="zh"
  title="形状"
/>

<DemoExample
  :demo="avatarFallback"
  description="图片加载失败时自动回退到姓名首字母；既没有图片也没有姓名时，则显示默认的人物图标。"
  locale="zh"
  title="回退"
/>

<DemoExample
  :demo="avatarStatus"
  description="把 AvatarStatusDot 放进 status 插槽，就能在头像角落标示在线、忙碌等状态。"
  locale="zh"
  title="状态"
/>
