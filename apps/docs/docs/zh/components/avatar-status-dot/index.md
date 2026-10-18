---
layout: component-docs
title: 头像状态点
outline: false
footer: false
---

<script setup lang="ts">
import { avatarStatusDotVariants } from '../../../../components/demos/avatar-status-dot'
</script>

## 使用方法

`AvatarStatusDot` 是头像右下角那个小圆点，用来说明这个人是在线、离开还是忙。颜色由 `variant` 决定。

只靠颜色区分，对色觉障碍的人是不够的，所以 `label` 尽量都写上。写了之后读屏会把它当成一张图片，念出这个状态名字；不写的话这个圆点对读屏完全隐藏，只在旁边已经用文字写明状态时才可以这么做。

```ts
import { AvatarStatusDot } from '@astryx-vue/core/Avatar'
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="avatarStatusDotVariants" title="变体" description="在头像上用 success、neutral、error 三种变体表示在线状态。把 AvatarStatusDot 放进 Avatar 的 status 插槽，圆点会贴在头像右下角。" locale="zh" />
