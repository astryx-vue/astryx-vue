---
layout: component-docs
title: 头像
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { avatarFallbackChain, avatarInitials, avatarInteractive, avatarPhoto, avatarStatus, avatarTooltip, avatarUserCard } from '../../../../components/demos/avatar'
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


<ComponentAnatomy />

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
  :demo="avatarFallbackChain"
  description="头像的回退顺序：主图、备用图、姓名首字母，最后是默认图标。"
  locale="zh"
  title="回退链"
/>

<DemoExample
  :demo="avatarInitials"
  description="没有照片时显示姓名首字母。头像会自动取名和姓的首字母。"
  locale="zh"
  title="姓名首字母"
/>

<DemoExample
  :demo="avatarInteractive"
  description="传入 href 时头像是链接，也可以用 as 换成路由链接。监听点击且没有地址时头像是按钮。两种形式都可聚焦，并带有 focus-visible 焦点环。"
  locale="zh"
  title="可交互"
/>

<DemoExample
  :demo="avatarTooltip"
  description="默认在悬停和键盘聚焦时用提示显示姓名。传入字符串可换成自定义文案，传入 false 则关闭提示。"
  locale="zh"
  title="提示"
/>

<DemoExample
  :demo="avatarUserCard"
  description="把头像放在姓名和角色旁边，组成一行用户信息。适合评论标题、联系人列表和资料区。"
  locale="zh"
  title="用户卡片"
/>

<DemoExample
  :demo="avatarPhoto"
  description="用不同尺寸展示头像照片。图片加载失败时改显示姓名首字母。"
  locale="zh"
  title="照片"
/>

<DemoExample
  :demo="avatarStatus"
  description="在头像上加状态点，表示在线、离开或忙碌。适合聊天和需要看得到在线状态的界面。"
  locale="zh"
  title="状态点"
/>
