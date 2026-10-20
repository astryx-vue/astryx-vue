---
layout: component-docs
title: 头像组溢出
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { avatarGroupOverflowCustomText, avatarGroupOverflowDefaultCount, avatarGroupOverflowWideCount } from '../../../../components/demos/avatar-group-overflow'
</script>

## 使用方法

`AvatarGroupOverflow` 放在头像组的末尾，用来交代那些没有单独画出来的人。一组成员被截成几个头像、但剩下多少人仍然要紧时，就用它。

`count` 是没画出来的人数，读屏读到的名字也由它拼出来，所以它要和看到的数字对得上。这个名字跟着当前语言走，英文念 "5 more"，中文念「还有 5 项」。默认插槽可以换掉 `+N` 这段文字；文字短时标记是个圆，文字长一点就长成胶囊，数字总能塞得下。加了 `@click`，这个标记就变成能聚焦的真按钮；不加，它只是一张静态图。

```vue
<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { AvatarGroup, AvatarGroupOverflow } from '@astryx-vue/core/AvatarGroup'
</script>

<template>
  <AvatarGroup size="lg">
    <Avatar name="Alex Daniels" />
    <Avatar name="Ann Smith" />
    <AvatarGroupOverflow :count="12" />
  </AvatarGroup>
</template>
```

<ComponentAnatomy />

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | `count` 传真实的隐藏人数，这样读屏读到的名字和看到的数字是一致的。 |
| <Badge variant="success">推荐</Badge> | 自定义文字用 `+12`、`99+` 这种短的。标记短的时候是圆，长一点会自己长成胶囊，数字总能塞得下。 |
| <Badge variant="success">推荐</Badge> | 点开之后要弹成员名单、浮层或者详情时，配上 `onClick`。 |
| <Badge variant="error">避免</Badge> | 不要让自定义文字和 `count` 说两件事。读屏读的仍是 `count`。 |
| <Badge variant="error">避免</Badge> | 别往标记里塞长文字。虽然它会拉成胶囊，但里面放一整句只会变成噪音；想交代更多参与者信息，放在头像组旁边。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="avatarGroupOverflowCustomText" title="自定义文字" description="隐藏的人数需要按产品习惯写得更紧凑时，塞一段像 12+ 这样的短文字进去。" locale="zh" />

<DemoExample :demo="avatarGroupOverflowDefaultCount" title="默认计数" description="不塞任何内容，就用默认的 +N 计数。" locale="zh" />

<DemoExample :demo="avatarGroupOverflowWideCount" title="宽计数" description="数字变宽时圆圈会拉成胶囊：高度不变，只有宽度在长，四位数也塞得下。" locale="zh" />
