---
layout: component-docs
title: 滚动条 Provider
outline: false
footer: false
---

<script setup lang="ts">
import { scrollbarsProviderCustomContainer, scrollbarsProviderOverview } from '../../../../components/demos/scrollbars-provider'
</script>

## 使用方法

把应用包一层，所有会滚动的 Astryx 组件就从浏览器自带的滚动条，换成一套自绘的覆盖式滚动条：细、不占宽度、不滚的时候自己收起来，明暗主题自动跟着走。

这是 astryx-vue 额外加的能力，原版 Astryx 没有。底层用的是 [OverlayScrollbars](https://kingsora.github.io/OverlayScrollbars/)（MIT 协议），已经内置在 `@astryx-vue/core` 里，不用自己装。

**默认是关的。** 不套 `ScrollbarsProvider`，组件和以前完全一样。而且没套的时候，OverlayScrollbars 的 JS 和 CSS 都不会进你的包，因为只有 `ScrollbarsProvider` 会引它们。

```ts
import { ScrollbarsProvider } from '@astryx-vue/core/Scrollbars'
```

30 秒接入，在 `App.vue` 里套一层就行：

```vue
<script setup lang="ts">
import { ScrollbarsProvider } from '@astryx-vue/core/Scrollbars'
</script>

<template>
  <ScrollbarsProvider>
    <RouterView />
  </ScrollbarsProvider>
</template>
```

常用的几个属性：

- `enabled`：开关，默认 `true`。设成 `false` 就整棵子树回到原生滚动条。
- `autoHide`：什么时候把滚动条收起来。`'scroll'`（默认）是滚的时候才出现，`'leave'` 是鼠标离开后收起，`'move'` 是鼠标动的时候出现，`'never'` 是一直显示。
- `autoHideDelay`：收起前等多少毫秒，默认 800。
- `options`：直接传给 OverlayScrollbars 的选项，优先级最高，后面有例子。

## 示例

<DemoExample :demo="scrollbarsProviderOverview" title="Scrollbars Provider — 开关对比" description="一块带长列表的 ScrollableArea，一块有横向滚动的 CodeBlock，一起包在 ScrollbarsProvider 里。打开和关掉开关，对比原生滚动条和自绘滚动条。" locale="zh" />

<DemoExample :demo="scrollbarsProviderCustomContainer" title="Scrollbars Provider — 自己的滚动容器" description="一个自己写的 overflow: auto 的 div，用 useScrollbars 接上自绘滚动条。外观用 CSS 变量改：这里调粗了滚动条，换成了强调色。" locale="zh" />

## 会自动换上的组件

套了 Provider 之后，下面这些组件里的滚动区域会自动换成自绘滚动条，不用你改代码：

- 滚动容器：`ScrollableArea`、`Layout`（`LayoutContent` 和 `LayoutPanel` 可滚动时）、`Card`、`Stack` 和 `StackItem`（可滚动时）
- 菜单和选择：`DropdownMenu`、`ContextMenu`、`MoreMenu`、`Selector`、`MultiSelector`、`ComplexSelector`、`CommandPalette`
- 输入候选：`Typeahead`、`Tokenizer`、`PowerSearch` 的候选列表，`TimeInput`、`DateRangeInput`
- 浮层：`Popover`、`AlertDialog`、`BottomSheet`
- 导航：`SideNav`、`MobileNav`
- 数据展示：`Table`、`CodeBlock`
- 对话：`Chat` 的消息区和触发菜单

## 不会换的地方

- `Chat` 的输入框。它是可编辑区，换了会影响输入。
- `<textarea>`。
- `Markdown` 里表格的横向滚动。
- 页面本身（`body`）的滚动条。

这些地方还是原生滚动条。

## 自己的滚动容器

首选 [`ScrollableArea`](/components/scrollable-area)。它自带无障碍名称、键盘聚焦和溢出判断，套了 Provider 就自动换上自绘滚动条，不用再想别的。

只有一种情况需要 `useScrollbars`：你已经有一个自己写的滚动容器，不想换成 `ScrollableArea`。把这个元素的 ref 交给它：

```vue
<script setup lang="ts">
import { useScrollbars } from '@astryx-vue/core/Scrollbars'
import { shallowRef } from 'vue'

const el = shallowRef<HTMLElement | null>(null)
const { active } = useScrollbars(el)
</script>

<template>
  <div ref="el" class="feed">
    <!-- 很长的内容 -->
  </div>
</template>

<style scoped>
.feed {
  height: 240px;
  overflow: auto;
}
</style>
```

几个要点：

- 容器自己就是滚动的视口，里面的子节点不会被搬动。它只会在容器末尾多追加两个滚动条用的 `div`。
- 外层没有 `ScrollbarsProvider` 时，`useScrollbars` 什么都不做，`active` 一直是 `false`。
- 容器的 `overflow` 是什么，滚动条就跟着是什么。你自己要保证它能滚。
- `useScrollbars` 要在 `ScrollbarsProvider` 的**后代组件**里调用。在写 Provider 的那个组件里直接调，是读不到的。

## 局部关掉

只想让某一块保留原生滚动条，有三种办法，看你想关多大的范围。

**关掉一块 `ScrollableArea`：**

```vue
<ScrollableArea label="日志" :height="240" :scrollbars="false">
  ...
</ScrollableArea>
```

**关掉一棵子树。** 嵌套一层 Provider，里面的覆盖外面的：

```vue
<ScrollbarsProvider>
  <Main />
  <ScrollbarsProvider :enabled="false">
    <Sidebar />
  </ScrollbarsProvider>
</ScrollbarsProvider>
```

**关掉自己的某个容器。** 给 `useScrollbars` 传 `enabled`，可以是布尔值、ref 或者 getter：

```ts
const { active } = useScrollbars(el, { enabled: () => props.fancy })
```

外层 Provider 是关的时候，这里写 `true` 也不会生效。

## 改外观

外观走 CSS 变量，都有默认值，并且跟着主题 token 走，不用额外配明暗。

<div class="component-api-table" role="region" aria-label="滚动条 CSS 变量" tabindex="0">
<table><thead><tr><th>变量</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>--astryx-scrollbar-size</code></td><td><code>10px</code></td><td>滚动条的粗细，含两侧各 2px 的留白。</td></tr>
<tr><td><code>--astryx-scrollbar-thumb</code></td><td>次要文字色的 45% 透明度</td><td>滑块的颜色。</td></tr>
<tr><td><code>--astryx-scrollbar-thumb-hover</code></td><td>次要文字色的 70% 透明度</td><td>鼠标悬停和拖动时滑块的颜色。</td></tr>
<tr><td><code>--astryx-scrollbar-track</code></td><td><code>transparent</code></td><td>轨道的背景色。</td></tr>
<tr><td><code>--astryx-scrollbar-radius</code></td><td><code>9999px</code></td><td>轨道和滑块的圆角。</td></tr>
</tbody></table>
</div>

想全站统一改，写在 `astryx.overrides` 层里：

```css
@layer astryx.overrides {
  :root {
    --astryx-scrollbar-size: 12px;
    --astryx-scrollbar-thumb: color-mix(in srgb, var(--astryx-color-text-primary) 35%, transparent);
    --astryx-scrollbar-radius: 4px;
  }
}
```

变量可以写在任何祖先元素上，所以只想改某一块，就写在那一块的选择器里。也可以放进 [`Theme`](/components/theme) 的主题变量里，跟着主题一起切。更多变量的约定见 [CSS 变量](/themes/css-variables)。

### 用 options 改行为

`options` 会原样传给 OverlayScrollbars，深合并，并且优先级最高，连 `autoHide` 都会被它盖掉。

```vue
<ScrollbarsProvider
  :options="{
    scrollbars: {
      clickScroll: 'instant',
      visibility: 'visible',
    },
  }"
>
  <App />
</ScrollbarsProvider>
```

- `clickScroll: 'instant'`：点一下轨道，视口直接跳到那里。默认是关的。想要平滑滚过去（`true`），得另外注册 OverlayScrollbars 的 `ClickScrollPlugin`。
- `visibility: 'visible'`：滚动条一直显示。默认 `'auto'`，只在内容溢出时显示。

完整的选项见 [OverlayScrollbars 文档](https://kingsora.github.io/OverlayScrollbars/)。

## 注意事项

- **服务端渲染**：首屏先显示原生滚动条，页面挂载后才换成自绘的。所以刚打开页面时可能有一瞬间的样式变化。
- **macOS**：系统默认「滚动时显示滚动条」，原生滚动条本来就是覆盖式的。在 macOS 上换完以后，主要差别是各个平台的样式统一了。
- **减少动效**：用户系统开了「减少动效」时，滚动条的过渡会关掉。
- **键盘、触屏、读屏**：行为不变。因为真正在滚动的，仍然是原来的那个元素，滚动条只是画在它上面。
- **没套 Provider**：什么都不会发生，也不会多加载任何代码。
