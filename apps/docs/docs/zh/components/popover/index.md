---
layout: component-docs
title: 弹出层
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { popoverBottomSheet, popoverConfirm, popoverFilter, popoverSettings, popoverShortcuts } from '../../../../components/demos/popover'
</script>

## 使用方法

`Popover` 在点击触发按钮时，在它旁边打开一个浮层。和只放纯文字的 Tooltip 不同，浮层可以承载简短的交互内容，例如一个小表单、一段补充说明或一组操作。触发元素放进默认插槽，浮层内容放进 `content` 插槽：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Popover } from '@astryx-vue/core/Popover'
</script>

<template>
  <Popover label="项目详情">
    <Button label="详情" variant="secondary" />
    <template #content>
      <p>这里放置简短内容。</p>
    </template>
  </Popover>
</template>
```





<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 弹出层内容只聚焦一项任务或一条信息。 |
| <Badge variant="success">推荐</Badge> | 提供明确的关闭方式：点击外部区域，或使用显式的关闭按钮。 |
| <Badge variant="error">避免</Badge> | 在弹出层中嵌套弹出层。这会造成混乱的焦点和导航。 |
| <Badge variant="error">避免</Badge> | 需要大量用户输入的内容，避免放在弹出层中。应使用 Dialog。 |
| <Badge variant="error">避免</Badge> | 在弹出层中放入过多内容。若需要滚动，应改用 Dialog。 |

## 示例

<DemoExample :demo="popoverBottomSheet" title="底部弹层" description="紧凑触屏上，项目操作改由底部弹层承接，而不是锚在按钮旁的弹出层。" locale="zh" />

<DemoExample :demo="popoverConfirm" title="确认操作" description="破坏性按钮打开一段简短确认，里面是删除和取消。" locale="zh" />

<DemoExample :demo="popoverFilter" title="筛选面板" description="按状态勾选，并提供应用和重置。" locale="zh" />

<DemoExample :demo="popoverShortcuts" title="键盘快捷键" description="列出快捷键以及各自的作用。" locale="zh" />

<DemoExample :demo="popoverSettings" title="设置面板" description="通知、深色模式和声音三个开关。" locale="zh" />

## 无障碍

弹出层要把自己的存在、当前的开合状态和内部内容告诉使用屏幕阅读器或键盘的用户。组件会自动把触发元素和浮层关联起来，并在浮层打开、关闭时管理焦点，你只需要提供必要的无障碍名称。

- 触发元素上带有 `aria-haspopup`、`aria-expanded` 与 `aria-controls`，辅助技术由此知道这是一个会打开浮层的按钮，并能读出浮层当前是展开还是收起。
- `dialog` 类型的浮层带有 `role="dialog"`；设置 `isModal` 时还会带有 `aria-modal="true"`，并以 `label` 作为无障碍名称。
- 打开时焦点移入浮层中的第一个可聚焦元素；用户按下 Escape 或关闭浮层时，焦点回到触发元素。
- 设置 `isModal` 后，浮层打开期间 Tab 焦点保持在浮层内。
- 内置关闭按钮在获得焦点前视觉隐藏，键盘聚焦到它时才显示出来。

## 布局

浮层通过 JavaScript 定位。页面滚动或窗口尺寸变化时会重新计算位置；所选方向空间不足时翻转到另一侧。
