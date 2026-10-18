---
layout: component-docs
title: 头像状态点
outline: false
footer: false
---

<script setup lang="ts">
import { avatarStatusDotIcon, avatarStatusDotVariants } from '../../../../components/demos/avatar-status-dot'
</script>

## 使用方法

`AvatarStatusDot` 是头像右下角那个小圆点，用来说明这个人是在线、离开还是忙。状态由 `variant` 决定。

每个变体的颜色都自带形状，状态不用只靠颜色分辨：`success` 是实心圆点，`neutral` 是空心环，`error` 是圆点上横一道减号。圆点还会读头像的尺寸，128px 的头像配 32px 的圆点，小头像配小圆点。

只靠颜色区分，对色觉障碍的人是不够的，所以 `label` 尽量都写上。放在头像里时，这个名字会并进头像自己的无障碍名称，读屏念的是「Jane Doe, Online」，而不是只念名字；单独使用时它就是圆点自己的图片名称。不写 `label` 的话这个圆点对读屏完全隐藏，只在旁边已经用文字写明状态时才可以这么做。

```ts
import { AvatarStatusDot } from '@astryx-vue/core/Avatar'
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="avatarStatusDotVariants" title="变体" description="在头像上用 success、neutral、error 三种变体表示在线状态。把 AvatarStatusDot 放进 Avatar 的 status 插槽，圆点会贴在头像右下角，大小跟着头像走。" locale="zh" />

<DemoExample :demo="avatarStatusDotIcon" title="图标" description="状态有自己的符号时，把图标放进 icon 插槽，顶掉自带的形状。头像很小时图标会收起来，换回自带的形状。" locale="zh" />
