---
layout: component-docs
title: 头像组
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { avatarGroupGroup, avatarGroupInteractive } from '../../../../components/demos/avatar-group'
</script>

## 使用方法

`AvatarGroup` 把多个头像重叠排列成一组，适合展示项目成员、协作者或群聊参与者。放不下的头像交给 `AvatarGroupOverflow`，它会把剩余人数概括为 +N。

基本用法：

```vue
<script setup lang="ts">
import { Avatar, AvatarGroup, AvatarGroupOverflow } from '@astryx-vue/core/AvatarGroup'
</script>

<template>
  <AvatarGroup size="md">
    <Avatar name="Ana Thomas" />
    <Avatar name="Ben Lee" />
    <Avatar name="Carol Davis" />
    <AvatarGroupOverflow :count="5" />
  </AvatarGroup>
</template>
```


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 在 `AvatarGroup` 上统一设置 `size` 和 `shape`，组内头像会自动继承，不必逐个指定。 |
| <Badge variant="success">推荐</Badge> | 只渲染需要直接展示的头像，剩余数量交给 `AvatarGroupOverflow` 以 +N 概括。 |
| <Badge variant="success">推荐</Badge> | 头像数量较多时，优先展示最近活跃或最重要的用户，其余折叠进溢出计数。 |
| <Badge variant="error">避免</Badge> | 避免为组内单个头像设置 `size` 或 `shape`：在组中这些设置不会生效，统一由 `AvatarGroup` 控制。 |
| <Badge variant="error">避免</Badge> | 避免一次展示过多头像，通常最多展示 3–5 个，其余交给溢出计数器概括，界面更清爽。 |

## 示例

<DemoExample
  :demo="avatarGroupGroup"
  description="把多张头像叠成一行，用来表示一组人。适合团队、审阅者或参与人数，既看得到面孔，又不占太多空间。"
  locale="zh"
  title="头像组"
/>

<DemoExample
  :demo="avatarGroupInteractive"
  description="头像链到个人资料，溢出指示器打开完整成员列表。整组是一个 Tab 停靠点，方向键在头像和溢出按钮之间移动。"
  locale="zh"
  title="可交互"
/>
