---
layout: component-docs
title: 导航标题菜单
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { navHeadingMenuSideNav, navHeadingMenuTopNav } from '../../../../components/demos/nav-heading-menu'
</script>

## 使用方法

导航标题旁边那个弹出菜单的容器和条目。`NavHeadingMenu` 提供 `role="menu"` 和键盘导航，`NavHeadingMenuItem` 画里面的每一个可选条目。把它放进 `SideNavHeading` 或 `TopNavHeading` 的 `menu` 插槽即可。

菜单在标题原位打开：弹出面板正好盖住标题，第一行就是标题本身（箭头朝上，点它收起菜单），下面才是各个条目，整块是一张圆角卡片。选中一个可用的条目会执行它的链接或 `click`，然后收起菜单。

```ts
import { NavHeadingMenu, NavHeadingMenuItem } from '@astryx-vue/core/NavMenu'
```

```vue
<script setup lang="ts">
import { NavHeadingMenu, NavHeadingMenuItem } from '@astryx-vue/core/NavMenu'
import { SideNav, SideNavHeading } from '@astryx-vue/core/SideNav'
</script>

<template>
  <SideNav>
    <template #header>
      <SideNavHeading heading="Acme Platform">
        <template #menu>
          <NavHeadingMenu size="lg">
            <NavHeadingMenuItem href="/dashboard" label="控制台" />
            <NavHeadingMenuItem href="/analytics" label="数据分析" />
          </NavHeadingMenu>
        </template>
      </SideNavHeading>
    </template>
  </SideNav>
</template>
```

## 键盘

键盘操作照 [WAI-ARIA APG 菜单模式](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)：

| 按键 | 作用 |
| --- | --- |
| <kbd>↓</kbd> / <kbd>↑</kbd> | 在标题的箭头按钮上打开菜单，焦点落到第一行或最后一行；在菜单里每次移动一行，到头后回到另一头。 |
| <kbd>Home</kbd> / <kbd>End</kbd> | 跳到第一行或最后一行。 |
| 字母键 | 跳到下一个以这个字母开头的条目。 |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | 激活当前条目。 |
| <kbd>Esc</kbd> | 收起菜单，焦点回到标题的箭头按钮。 |

## 无障碍

- 标题的箭头按钮带 `aria-haspopup="menu"`、`aria-expanded` 和 `aria-controls`，名字里含标题文字，读屏时知道打开的是哪个产品或空间的菜单。
- 弹出面板里，`role="menu"` 只包住条目；第一行重复的标题是一个普通按钮，不算菜单的一部分。
- 在标题的弹出层里，菜单用标题文字当名字；想换个名字就传 `label`。单独使用 `NavHeadingMenu` 时一定要传 `label`，否则菜单没有名字。
- 有 `href` 的条目渲染成链接，没有的是 `role="menuitem"` 的 `div`；禁用的条目带 `aria-disabled`。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 把 <code>NavHeadingMenu</code> 放进 <code>SideNavHeading</code> 或 <code>TopNavHeading</code> 的 <code>menu</code> 插槽，收起和焦点交给标题处理。 |
| <Badge variant="success">推荐</Badge> | 单独使用时给菜单传 <code>label</code>。 |
| <Badge variant="error">避免</Badge> | 不要在菜单里放别的控件。方向键只在 <code>NavHeadingMenuItem</code> 之间移动，别的控件会被跳过。 |
| <Badge variant="error">避免</Badge> | 用户暂时不能去、但知道它存在有帮助的目的地，不要直接删掉，改成 <code>isDisabled</code>。 |

## 示例

<DemoExample :demo="navHeadingMenuSideNav" description="侧栏标题打开产品切换菜单，面板盖在标题原位上，里面是 Dashboard、Analytics 和 Settings。" locale="zh" title="产品切换" />

<DemoExample :demo="navHeadingMenuTopNav" description="顶栏标题切换环境。条目带图标和说明，暂时不能用的环境设成禁用。" locale="zh" title="顶栏切换环境" />

<ComponentAnatomy />
