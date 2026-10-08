---
layout: component-docs
title: 底部弹窗
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { bottomSheetBasic, bottomSheetSnap, bottomSheetTall } from '../../../../components/demos/bottom-sheet'
</script>

## 使用方法

`BottomSheet` 从视口底部升起一块面板，用来承载筛选、分享、快速操作和表单这类移动端优先的内容。面板顶部有一条装饰性的拖拽条，下面是可以滚动的内容区；背景由遮罩压暗并阻挡交互。它基于原生 `<dialog>` 元素，因此在打开时会把焦点锁在面板内部、把页面其余部分设为不可交互，关闭后把焦点还给打开它的元素。

最基本的用法是自己管理开关状态，把标签和内容交给组件：

```vue
<script setup lang="ts">
import { BottomSheet } from '@astryx-vue/core/BottomSheet'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <button type="button" @click="isOpen = true">
    筛选
  </button>
  <BottomSheet v-model:is-open="isOpen" label="筛选">
    <p>这里放筛选条件。</p>
  </BottomSheet>
</template>
```

`label` 是必填项，它会成为面板的无障碍名称，屏幕阅读器在进入面板时会读出它。面板本身没有内置标题，所以这个名称需要由你提供。是否打开由 `isOpen` 决定：不绑定 `v-model:is-open` 时组件自己管理状态，Escape、点击遮罩或向下拖动都会关闭它；绑定时组件完全跟随绑定的值，这些操作只会发出 `openChange(false)` 请求，是否关闭由父组件决定。

`height` 决定面板展开后的高度，可以使用三个命名档位。`hug` 让面板贴合内容，最多占到视口的 92%，适合内容固定且不长的场景；`capped` 是默认档，约占视口高度的 62%，是列表类内容的常用选择；`tall` 固定在接近满屏的高度，适合表单或内容会持续变长的场景。也可以直接传数字（像素）或任意 CSS 长度，例如 `420` 或 `"min(70vh, 30rem)"`。无论哪个档位，内容超过可见高度时都在面板内部滚动，不会把页面撑长。

`snapPoints` 让用户可以拖动面板停在中间高度，而不仅仅是全开或关闭。每个点位写的是面板的可见高度：数字是视口比例（`0.5` 就是半个屏幕），`"50%"` 是同样的意思，`"320px"` 是绝对高度。面板自身的高度始终是最高的那一档，所以 `snap-points="[0.5]"` 表示「要么半屏，要么全屏」。短到只有自身四分之一以下的档位被视为「露一角」：它不重排内容，而是把整块面板滑走一部分，同时把遮罩调淡。不传 `snapPoints` 时面板只支持打开和关闭，拖动仍然可以关闭它。

向下拖动可以关闭面板，向上快速一甩会把面板展开到最高档。拖动时遮罩的深浅跟随面板的位置变化，松手后停到最近的档位。拖动条和（滚动到顶部后的）内容区都可以发起拖动。系统开启「减少动态效果」时，进入和退出的动画会缩短到几乎不可见，但面板的位置和状态变化照常发生。

`purpose` 控制隐式关闭的尺度，和 `Dialog` 一致。默认的 `info` 允许 Escape、点击遮罩和向下拖动；`form` 只允许 Escape，避免用户误触遮罩丢失已经输入的内容；`required` 屏蔽全部隐式关闭，并使用 `alertdialog` 语义，用于必须由用户明确响应的流程。想要面板和页面同时可交互时，把 `hasScrim` 设为 `false`：面板会用非模态方式打开，背景不再被压暗，页面可以继续滚动和点击，拖动关闭依旧可用。非模态面板不会把焦点从页面上抢走，因此 Escape 只在焦点位于面板内部时才会关闭它。

`padding` 设置内容区的内边距，取值来自全局间距刻度。不设置时使用主题为底部弹窗定义的内边距，主题没有定义时取 `--spacing-4`（16px），四个逻辑边相同；传入 `0` 可以让内容紧贴面板边缘。内容区同时是一个容器，如果它的唯一子元素是自带内边距的区块，那个区块会顶掉这层内边距，不会被叠加两次。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用在小屏上的临时任务：筛选、分享、快速操作、详情预览。让内容从底部升起，符合拇指的触达范围。 |
| <Badge variant="success">推荐</Badge> | 按内容选择高度档位：内容固定且短用 `hug`，列表用 `capped`，表单或持续变长的内容用 `tall`。 |
| <Badge variant="success">推荐</Badge> | 用 `purpose="form"` 保护已经输入的内容，同时保留 Escape；只有必须由用户明确结束的流程才用 `required`。 |
| <Badge variant="success">推荐</Badge> | 给 `label` 写清楚面板是什么，例如「筛选条件」「分享到」，它是屏幕阅读器进入面板时唯一的上下文。 |
| <Badge variant="error">避免</Badge> | 让面板内容过长。内容很多时考虑拆成多个步骤，或改用整页。 |
| <Badge variant="error">避免</Badge> | 在桌面端把它当默认的弹窗使用。需要居中的模态对话框时使用 `Dialog`。 |
| <Badge variant="error">避免</Badge> | 依赖拖动作为唯一的关闭方式。Escape、遮罩点击和显式的操作按钮同样重要。 |

## 示例

<DemoExample
  :demo="bottomSheetBasic"
  description="从底部升起的筛选面板：拖动条、标题和操作按钮，遮罩点击或 Escape 均可关闭。"
  locale="zh"
  title="基本用法"
/>

<DemoExample
  :demo="bottomSheetTall"
  description="tall 档位固定接近满屏高度，列表在面板内部滚动，页面本身不会被撑长。"
  locale="zh"
  title="列表"
/>

<DemoExample
  :demo="bottomSheetSnap"
  description="snapPoints 让用户把面板拖到半个屏幕的高度，松手后停在最近的档位。"
  locale="zh"
  title="拖动到中间高度"
/>

## 无障碍

面板基于原生 `<dialog>` 元素构建。带遮罩时使用 `showModal()` 打开，浏览器会把它放到顶层、把背景设为不可交互，并把 Tab 焦点限制在面板内；不带遮罩时使用 `show()` 打开，页面保持可用。`label` 通过 `aria-label` 成为面板的名称，`purpose="required"` 时角色变为 `alertdialog`。

打开时，焦点会落到面板内第一个带 `data-autofocus` 的元素上；没有这样的元素时，焦点落在面板本身。关闭后，焦点回到打开面板时的那个元素（如果它还在页面里），或者回到 `finalFocusRef` 指定的元素。抬起与关闭的动画结束后才执行焦点归还，避免焦点落在正在滑走的面板上。

Escape 只在 `purpose` 不是 `required` 时关闭面板（带遮罩的模态面板会把焦点限制在内部；无遮罩的面板不抢焦点，因此焦点需要位于面板内）；输入法正在组合文字时按下的 Escape 属于取消输入，不会关闭面板。内容区滚动到顶部后可以向下拖动关闭面板，滚动到内容底部时可以向上拖动展开面板；`purpose` 不是 `info` 时拖动只会停靠在最近的档位，不会关闭。

当内容区实际溢出时，它会成为一个可聚焦的滚动区域，带 `role="group"` 和面板的 `label` 作为名称，键盘用户可以聚焦它并用方向键滚动内容。

## 主题

```css
.my-sheet {
  --astryx-bottom-sheet-background: #ffffff;
  --astryx-bottom-sheet-foreground: #171717;
  --astryx-bottom-sheet-border: #d4d4d4;
  --astryx-bottom-sheet-handle-background: #d4d4d4;
  --astryx-bottom-sheet-scrim: #00000080;
  --astryx-bottom-sheet-shadow: 0 -12px 24px rgb(0 0 0 / 15%);
}
```

Neutral 主题自动适配明暗模式。`class` 与 `style` 会落在面板这个 `<div>` 上，而不是包裹它的 `<dialog>`，因此上面的变量写在面板上生效。
