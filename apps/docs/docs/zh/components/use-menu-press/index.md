---
layout: component-docs
title: useMenuPress
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

菜单表面的按压模型，鼠标和触摸都适用。从某一行开始的按压会被接管：按住手指时高亮跟着手指走，**松开**时手指下面是哪一行就由哪一行执行——替它派发一次 click，带上松开时的修饰键。触摸结束时浏览器补发的那次 click（目标是手指落下的那一行）会被吞掉，所以不会执行两次。指针按 `pointerId` 在文档层面跟踪，所以手指从落下那一行滑走之后仍然跟着走。鼠标按下时高亮就停在落下的那一行，由那一行自己的 click 执行；鼠标在菜单外松开时调用 `onDismiss`；手指在菜单外松开则让菜单继续开着；`pointercancel` 或者第二根手指按下，这次手势就以什么都不执行结束。

`ContextMenu` 已经挂上了。只有自己搭类似菜单的表面时才需要直接用它：把菜单根的 ref 传进来，菜单打开时启用，把 `menuProps` 摊到根上。`onPointerDown` 是同一个处理函数，不好摊对象时单独绑它。

行就是根里面可用的 `[role="menuitem"]`、`[role="menuitemradio"]`、`[role="menuitemcheckbox"]` 元素，层边界是 `[role="menu"]`。想用别的选择器挑行就传 `itemSelector`；不想用 DOM 焦点表示高亮就传 `onHighlight`；想自己执行那一行就传 `onActivate`。`resetMenuPress()` 用来清掉已经布好的「吞掉多余 click」，卸载和测试里用。

触发器那一侧是可选能力：给它 `triggerRef` 和 `onTriggerPress`，把 `triggerProps` 摊到触发器上，主键一按下就开，手指要按满 `longPressDelayMs` 才开；右键不碰，它自己的 `contextmenu` 照旧能用。两种都能一路滑进菜单里：手指下面那一行跟着高亮，松开时手指下面是哪一行就由哪一行执行。结束这次手势的那次 click 用 `isTriggerClickFromPress()` 问出来，触发器自己的 click 就不会再切换或重开。`triggerProps.onContextMenu` 只管挡掉手指长按时浏览器自带的那套菜单，鼠标右键仍然交给应用自己处理。

```ts
import { useMenuPress } from '@astryx-vue/core'
```

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 传的选择器只挑可用的行，这样指针压在分割线、标题或禁用行上时什么都不挑，而不是亮一下。 |
| <Badge variant="success">推荐</Badge> | 让高亮就是 DOM 焦点：hook 会把指针下面那一行聚焦（`preventScroll`）。当前行用 `:focus` 画出来。只有列表要把焦点留在组合框上时，才自己传 `onHighlight`。 |
| <Badge variant="success">推荐</Badge> | 在菜单根上声明 `touch-action`：行放得下时用 `pinch-zoom`，会滚动时用 `pan-y pinch-zoom`，让浏览器（而不是 hook）判断手指是不是在滚动，双指捏合也仍然能缩放页面。 |
| <Badge variant="error">避免</Badge> | 又在自己行的 `pointerdown` 或 `pointerup` 里执行一次；hook 已经按松开位置执行那一行，两条路会执行两遍。 |
| <Badge variant="error">避免</Badge> | 把 `detail` 为 0 的行 click 当成键盘触发；hook 派发的指针激活 `detail` 也是 0。派发出来的 click 不是可信事件，用 `event.isTrusted` 区分。 |
