---
layout: component-docs
title: 上下文菜单
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { contextMenuBasic, contextMenuCompound, contextMenuOverview, contextMenuSubmenu } from '../../../../components/demos/context-menu'
</script>

## 使用方法

`ContextMenu` 为某一块界面提供上下文操作：用户在触发器区域内点右键（或按下键盘的菜单键、在触屏上长按），菜单就在指针位置展开。它适合列表行、画布、文件节点、表格单元格这类「操作属于某个具体对象、又不想为每个对象摆一排按钮」的场景。菜单里的每一行和普通菜单一样可以带图标、说明、快捷键位和禁用状态。

指针位置会被换算成触发器内部的坐标，并落在一个零尺寸的锚点上，因此菜单是相对触发器定位而不是相对视口定位的：页面滚动时它跟着内容走，靠近视口下缘时会自动翻到上方，而不会跑出屏幕。

内容有两种写法。数据驱动的方式把菜单项交给 `items`：

```vue
<script setup lang="ts">
import type { ContextMenuOption } from '@astryx-vue/core/ContextMenu'
import { ContextMenu } from '@astryx-vue/core/ContextMenu'

const items: ContextMenuOption[] = [
  { label: '重命名', icon: 'i-carbon-tools' },
  { label: '复制链接', icon: 'i-carbon-copy' },
  { type: 'divider' },
  { label: '删除', variant: 'destructive' },
]
</script>

<template>
  <ContextMenu :items="items" label="文件操作">
    <div>在这里点右键</div>
  </ContextMenu>
</template>
```

`items` 的元素有三种形态：动作条目（`label` 必需，可带 `icon`、`description`、`endContent`、`onClick`、`isDisabled`、`variant`、`hasCloseOnSelect`、`href`/`target`/`rel`），分隔线 `{ type: 'divider' }`，以及分组 `{ type: 'section', title, items }`。条目再带上 `items` 就会变成子菜单，悬停或按右方向键会在旁边展开下一级。其中的 `icon` 是一个 CSS 图标类（例如 UnoCSS 的 `i-carbon-copy`，也可以是你自己的类名），或者一个绘制 SVG 的组件；astryx-vue 不自带图标。

菜单内容需要自己组合时，改用 `content` 插槽，并用导出的菜单组件搭出结构。两种写法共用同一套键盘行为：

```vue
<template>
  <ContextMenu label="文件操作">
    <div>在这里点右键</div>
    <template #content>
      <ContextMenuItem icon="i-carbon-tools" label="重命名" />
      <ContextMenuDivider />
      <ContextMenuGroup title="危险操作">
        <ContextMenuItem label="删除" variant="destructive" />
      </ContextMenuGroup>
    </template>
  </ContextMenu>
</template>
```

开关状态默认由组件自己管理：右键打开，点击菜单外部、按 Escape、按 Tab 都会关闭。每次开关都会通过 `openChange` 事件报告新状态。需要由外部决定是否展开时，用 `v-model:is-open` 绑定状态，此时组件完全跟随绑定的值。

打开后焦点会落到第一个可用的条目上。上下方向键在条目之间移动并在两端循环，Home/End 跳到首尾，PageDown/PageUp 按一屏翻动，直接键入字母会跳到标签以这些字母开头的条目（反复按同一个字母会在匹配项之间轮转）。Enter 和空格执行当前条目，Escape 关闭菜单并把焦点交还给打开菜单前聚焦的元素，Tab 则关闭菜单并让浏览器继续从那里往后移动焦点。被禁用的条目会带 `aria-disabled`、退出 Tab 顺序，同时被方向键和键入跳转跳过。菜单本身是 `role="menu"`，条目是 `role="menuitem"`，分组是 `role="group"`，分隔线是 `role="separator"`。

`isDisabled` 会让组件不再拦截右键：原生浏览器菜单照常出现，这样用户可以复制文字或使用浏览器自带的功能。`triggerAs` 决定触发器渲染成块级 `div` 还是行内 `span`，后者让一段行文中的词也能拥有自己的上下文菜单而不破坏排版。

菜单面板的宽度默认至少 160px 并随内容伸缩，`menuWidth` 可以给出确定宽度；无论哪种方式，面板都不会超出视口，超长内容会换行并被限制在最高 300px 的滚动区域内。`size` 只改变条目的上下内边距，`sm`、`md`、`lg` 依次更宽松。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 菜单项用动词短语写清楚会发生什么，「重命名」「复制链接」比「操作」「更多」更容易被理解。 |
| <Badge variant="success">推荐</Badge> | 条目较多时用分组和分隔线分区，一块区域只放同一类操作。 |
| <Badge variant="success">推荐</Badge> | 所有操作同时提供可见入口。并非所有人都知道可以右键，屏幕阅读器用户也需要能被提示。 |
| <Badge variant="success">推荐</Badge> | 危险操作放在菜单最下方，用 `variant="destructive"` 标出。 |
| <Badge variant="success">推荐</Badge> | 行文中的词需要上下文菜单时使用 `triggerAs="span"`，避免在段落里插入块级元素。 |
| <Badge variant="error">避免</Badge> | 把上下文菜单当作访问重要功能的唯一方式。移动端的长按和桌面端的右键都是隐式手势，容易被漏掉。 |
| <Badge variant="error">避免</Badge> | 在单个菜单里堆超过十来个条目而不分组。菜单越长越难扫，也很难在视线范围内读完。 |
| <Badge variant="error">避免</Badge> | 用菜单承载需要输入多步的表单。复杂流程应改用对话框或独立页面。 |

## 示例

<DemoExample
  :demo="contextMenuOverview"
  description="The painted menu surface: rows with icons and a secondary description, a divider, and a destructive action."
  locale="zh"
  title="菜单表面"
/>

<DemoExample
  :demo="contextMenuBasic"
  description="数据驱动的菜单：动作条目、禁用条目、分组、分隔线与危险操作，选中结果会写回页面。"
  locale="zh"
  title="基本用法"
/>

<DemoExample
  :demo="contextMenuCompound"
  description="复合模式：用 content 插槽和菜单组件自己组合内容，其中一行选中后不关闭菜单，而是在原处报告结果。"
  locale="zh"
  title="自定义内容"
/>

<DemoExample
  :demo="contextMenuSubmenu"
  description="嵌套的 items 让条目变成子菜单，悬停或按右方向键会展开下一级，多层嵌套同样适用。"
  locale="zh"
  title="子菜单"
/>
