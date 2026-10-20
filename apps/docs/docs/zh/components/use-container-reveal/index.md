---
layout: component-docs
title: useContainerReveal
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useContainerRevealRows } from '../../../../components/demos/use-container-reveal'
</script>

## 使用方法

一个不带外观的「悬停或聚焦才露出」原语。给容器挂上一段作用域内的触发逻辑：鼠标停在容器上，或者键盘焦点进到容器里，容器里的内容就露出来（或者反过来藏起来），也就是常见的「行操作悬停才出现」。露出完全由 CSS 完成：Vue 里不存悬停状态，悬停也不会引起重新渲染。调用方不用为露出写任何 CSS，hook 会给容器的类，也会给内容的类；嵌套的容器盖住外层，所以两层互不串味。无障碍上是自带的：藏起来的内容用定位和不透明度藏（绝不 `display: none`），所以它仍然挂在树上、仍然在 Tab 顺序里、读屏也读得到；`:focus-within` 时会露出，键盘 Tab 进来就能看见；触摸设备上一直可见（不会因为粗指针没有 hover 而丢掉）；也尊重 `prefers-reduced-motion`。

`containerProps()` 返回容器的 `class` 和 `style`，`contentProps()` 返回每个待露出子元素的 `class`。分别用 `:class` 和 `:style` 绑上去。

```ts
import { useContainerReveal } from '@astryx-vue/core'
```

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 取出 `containerProps` 和 `contentProps`：`containerProps()` 绑在容器上（和你自己的类一起），`contentProps()` 绑在要露出的内容上。 |
| <Badge variant="success">推荐</Badge> | 只用来放次要操作：列表或表格行上的编辑、复制、删除，卡片或媒体块上的浮层控件（例如 `Thumbnail` 的删除按钮）。 |
| <Badge variant="success">推荐</Badge> | 组件自己的 prop 决定「悬停才露出」还是「一直显示」时，用 `isEnabled` 关掉它；它随时可以变。 |
| <Badge variant="success">推荐</Badge> | 绝对定位或浮层类的内容传 `isLayoutPreserved`，提前占好位置，出现时不会把布局顶动。 |
| <Badge variant="success">推荐</Badge> | 长列表的行设一个 `hoverDelay`（100-250 毫秒），鼠标扫过列表时就不会一路点亮每一行；键盘和触摸仍然立即露出。 |
| <Badge variant="success">推荐</Badge> | 交互由别的东西掌管时（拖拽、滚动或动效门控、行的菜单已打开）用 `forceState`；只要某一个元素不跟容器走时用 `forceVisibility`。 |
| <Badge variant="error">避免</Badge> | 绕过 API 去改 hook 内部的私有自定义属性（`--_reveal-opacity` 之类）来压住露出；用 `forceState` / `forceVisibility`，改名也不会坏。 |
| <Badge variant="error">避免</Badge> | 用它藏那些必须随时能被发现的内容；重要操作就一直显示，别挂在悬停后面。 |

## 示例

<DemoExample
  :demo="useContainerRevealRows"
  description="文件行平时把编辑和删除藏起来，悬停或用键盘聚焦时通过 useContainerReveal 露出；操作一直在树上，也在 Tab 顺序里。"
  locale="zh"
  title="useContainerReveal — 悬停露出的行操作"
/>
