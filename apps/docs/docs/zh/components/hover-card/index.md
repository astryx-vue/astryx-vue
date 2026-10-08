---
layout: component-docs
title: 悬浮卡片
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { hoverCardBasic, hoverCardControlled, hoverCardPlacements } from '../../../../components/demos/hover-card'
</script>

## 使用方法

`HoverCard` 在鼠标悬停或键盘聚焦触发元素时，弹出一张承载更丰富内容的卡片。它和 `Tooltip` 的区别在于内容：`Tooltip` 只放一行纯文本，而悬浮卡片可以放头像、姓名、简介和操作按钮，因此要显示用户的资料、链接的预览或术语的解释时，它是合适的选择。

卡片有一个默认 300 毫秒的显示延迟，避免指针扫过触发元素时就闪出卡片。隐藏也有一个默认 200 毫秒的延迟，并且指针移入卡片会取消这次隐藏，所以用户可以从触发元素把指针移进卡片里继续阅读或点击，卡片不会在途中消失。

触发元素写在默认插槽里，卡片内容写在 `content` 插槽里：

```vue
<script setup lang="ts">
import { HoverCard } from '@astryx-vue/core/HoverCard'
</script>

<template>
  <HoverCard label="Dana Whitfield">
    Dana Whitfield
    <template #content>
      <p>Design systems engineer, Amsterdam.</p>
    </template>
  </HoverCard>
</template>
```

触发元素是纯文字时，组件会给它加上虚线底划线并让它可聚焦，键盘用户按 Tab 就能打开卡片；触发元素本身是一个按钮或链接时，组件直接监听那个元素，并把 `aria-haspopup`、`aria-controls` 这类属性写在它身上。传入 `label` 后卡片会以具名的 `role="dialog"` 暴露给屏幕阅读器，不传 `label` 时则是 `role="group"`，并通过 `aria-describedby` 指向卡片内容。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 把悬浮卡片当作补充信息：有它更好理解，没它也能完成任务。 |
| <Badge variant="success">推荐</Badge> | 用纯文字作为触发元素，让虚线下划线和键盘聚焦默认生效，用户能看出这里可以悬停。 |
| <Badge variant="success">推荐</Badge> | 内容是资料那就传 `label`，卡片会以具名对话框的形式出现在辅助技术的浏览顺序里。 |
| <Badge variant="success">推荐</Badge> | 让 `touchTrigger` 保持默认的 `auto`：本身不执行操作的触发元素轻点即打开，按钮和链接的轻点仍然归它们自己。 |
| <Badge variant="error">避免</Badge> | 把关键操作或必须看到的信息只放在卡片里。指针一移开卡片就消失，用户很容易错过。 |
| <Badge variant="error">避免</Badge> | 用悬浮卡片替代简单的提示或弹层。一行说明用 `Tooltip`，需要用户点击确认的内容用 `Popover`。 |
| <Badge variant="error">避免</Badge> | 在卡片里放需要长时间输入的表单。指针离开会让它关闭，这类内容应放进对话框。 |
| <Badge variant="error">避免</Badge> | 在 `<p>`、标题或链接内部直接使用。这些位置虽然可用，但浮层与文档流的关系会变得难以预测，优先放在块级上下文里。 |

## 示例

<DemoExample :demo="hoverCardBasic" title="基本用法" description="悬停或聚焦链接，卡片在短暂延迟后显示，指针移入卡片后仍保持打开。" locale="zh" />

<DemoExample :demo="hoverCardPlacements" title="位置" description="placement 设置卡片相对触发元素的方向，空间不足时自动翻转到另一侧。" locale="zh" />

<DemoExample :demo="hoverCardControlled" title="受控" description="传入 isOpen 控制显示。悬停和聚焦不再生效，按 Escape 只会发出 openChange(false)。" locale="zh" />

## 无障碍

悬浮卡片是一层独立的浮层，组件把两者用 ARIA 属性关联起来，屏幕阅读器既能知道触发元素多了一段说明，也能在卡片打开时读到里面的结构和操作：

- 卡片带有 `role="group"`；传入 `label` 后改为具名的 `role="dialog"`，因为无名对话框不符合规范，而无名的 `group` 是合法的。
- 未传 `label` 时，触发元素带有 `aria-describedby` 指向卡片。
- 传了 `label` 时，触发元素改为带有 `aria-haspopup="dialog"`，卡片打开期间再带上 `aria-controls`。`aria-expanded` 只在触发器本身允许该属性时才会写入；纯文字触发的 `<span>` 没有对应角色，因此不会带上它。
- 触发元素原有的 `aria-haspopup`、`aria-controls`、`aria-expanded`、`aria-describedby` 会被保留，组件卸载时恢复原值。

键盘也能完整操作：聚焦触发元素会立即打开卡片，焦点在触发元素和卡片之间移动时卡片保持打开。卡片显示期间按 Escape 会关闭它；如果焦点当时在卡片内部，焦点会回到触发元素，且不会因为这次回焦而重新打开。受控模式下 Escape 只发出 `openChange(false)`，是否关闭由父组件决定。

触摸设备上没有悬停，所以轻点触发元素的行为由 `touchTrigger` 决定：默认的 `auto` 让本身不执行操作的触发元素轻点即打开，按钮、链接和表单控件则保留自己的轻点；打开后的卡片在卡片外轻点即关闭。因为内容只出现一小会儿，不要把用户完成任务必须看到的信息只放在卡片里。
