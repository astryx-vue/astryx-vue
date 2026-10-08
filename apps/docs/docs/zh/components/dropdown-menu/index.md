---
layout: component-docs
title: 下拉菜单
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dropdownMenuBasic, dropdownMenuOverview, dropdownMenuSections, dropdownMenuShortcuts } from '../../../../components/demos/dropdown-menu'
</script>

## 使用方法

`DropdownMenu` 把一个按钮变成一组操作的入口。按钮本身很轻，真正的菜单在点击后才出现，浮在触发按钮旁边，选完一项就收起，焦点回到按钮上。它适合放“下一步要做什么”——重命名、复制、归档、删除这类只有一层的动作。

最小用法只需要一个 `items` 数组，每一项就是一条动作：

```vue
<script setup lang="ts">
import { DropdownMenu } from '@astryx-vue/core/DropdownMenu'
</script>

<template>
  <DropdownMenu
    :button="{ label: '操作' }"
    :items="[
      { label: '编辑项目', icon: 'i-carbon-tools', onClick: () => edit() },
      { label: '复制项目', icon: 'i-carbon-copy', onClick: () => duplicate() },
      { label: '删除项目', icon: 'i-carbon-trash-can', variant: 'destructive', onClick: () => remove() },
    ]"
  />
</template>
```

`items` 里可以出现三种条目：一条动作（`label` 加上 `onClick`，或加上 `href` 变成链接行），一条分隔线 `{ type: 'divider' }`，以及一个带标题的分组 `{ type: 'section', title, items }`。当菜单内容需要根据状态变化、或者要自己写一段模板时，关掉 `items`，改用默认插槽写 `DropdownMenuItem`、`DropdownMenuGroup` 和 `DropdownMenuDivider`，两种写法渲染出的 DOM 完全一致。行上的 `icon` 是一个 CSS 图标类（例如 UnoCSS 的 `i-carbon-copy`，也可以是你自己的类名），或者一个绘制 SVG 的组件；astryx-vue 不自带图标。

触发按钮默认由设计系统的 `Button` 渲染，通过 `button` 传入它的属性（`variant`、`size`、`isIconOnly` 等）；`size` 会同时决定菜单行的高度，所以 `size="sm"` 的按钮配一组紧凑的菜单行。当触发按钮不是普通按钮时——比如一个纯图标按钮、一个头像、列表里的一行——改用 `trigger` 插槽，并把插槽给出的属性整个 `v-bind` 到自己的控件上，菜单就会挂在这个控件旁边，并用它的名字作为无障碍名称。

```vue
<template>
  <DropdownMenu>
    <template #trigger="triggerProps">
      <IconButton v-bind="triggerProps" icon="i-carbon-overflow-menu-horizontal" label="更多操作" />
    </template>

    <DropdownMenuItem icon="i-carbon-tools" label="编辑项目" @click="edit" />
  </DropdownMenu>
</template>
```

打开之后，菜单接管键盘：上下方向键在动作之间移动并循环，`Home` 和 `End` 跳到首尾，`PageUp`/`PageDown` 翻一屏，直接键入字母会跳到以该字母开头的下一行（连续按同一个字母会在多个匹配项之间轮换），`Enter` 和空格执行当前这一行，`Escape` 或点击菜单外部收起菜单并把焦点还给触发按钮，`Tab` 也会收起菜单，然后按浏览器的顺序继续往后走。鼠标划过某一行时焦点会跟到那一行，所以键盘高亮和鼠标高亮永远是同一个，不会同时亮两行。

用键盘打开和用鼠标打开有一个区别：键盘打开会把焦点放在第一行（按 `ArrowUp` 打开则放在最后一行），鼠标打开只把焦点放在菜单本身，不预选任何一行——否则用户会以为那一行已经被选中了。

弹层会自己找位置：默认开在触发按钮下方左对齐，空间不够时翻到上方；`placement` 和 `alignment` 可以改成上/下/左/右和起点/居中/终点。菜单宽度默认与触发按钮齐平并封顶在 320px，`menuWidth` 可以给定宽度或 `max-content` 之类的关键字宽度；高度默认封顶 300px，超出就滚动，`menuMaxHeight` 可以按像素把上限抬高到刚好放下所有行。

需要外部控制开关时用 `v-model:is-menu-open`。菜单在挂载时就处于打开状态的话，不会抢走焦点——这不是用户要求的打开动作，把焦点从页面里拽走会让人丢失位置。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用动词开头的短句写动作名，让用户扫一眼就知道每一项会做什么。 |
| <Badge variant="success">推荐</Badge> | 动作超过五六项时用分组和分隔线把它们分簇，一簇里放同一类事情。 |
| <Badge variant="success">推荐</Badge> | 危险的动作用 `variant="destructive"` 标成错误色，并且放在菜单更靠下的位置。 |
| <Badge variant="success">推荐</Badge> | 需要提示快捷键时，把提示放进 `endContent` 插槽（通常是一个 `Kbd`），不要拼进 `label` 文本里。 |
| <Badge variant="success">推荐</Badge> | 触发控件不是普通按钮时用 `trigger` 插槽，并把插槽属性整份 `v-bind` 出去；只取其中一部分会让 `aria-expanded` 或 `aria-controls` 丢掉，屏幕阅读器就不知道菜单开没开。 |
| <Badge variant="error">避免</Badge> | 用下拉菜单做页面导航。菜单是“做一件事”，导航该用导航组件。 |
| <Badge variant="error">避免</Badge> | 在同一个菜单里塞十几项而不分组。用户找不到东西，也会漏看后面的选项。 |
| <Badge variant="error">避免</Badge> | 把菜单当作表单。需要输入或选择多项时，用对话框或专门的表单控件。 |

## 示例

<DemoExample
  :demo="dropdownMenuOverview"
  description="展开后的菜单：分组标题、图标、次行说明、快捷键提示、分隔线和危险动作。"
  locale="zh"
  title="菜单结构"
/>

<DemoExample
  :demo="dropdownMenuBasic"
  description="用 items 数组铺一组动作。选中任意一项后菜单收起，并把焦点交还给触发按钮。"
  locale="zh"
  title="基本用法"
/>

<DemoExample
  :demo="dropdownMenuSections"
  description="用 section 条目给动作分簇，簇与簇之间用 divider 隔开；分组标题不会被方向键选中。"
  locale="zh"
  title="分组与分隔线"
/>

<DemoExample
  :demo="dropdownMenuShortcuts"
  description="换成纯图标触发按钮，并用 endContent 插槽把快捷键提示放在行的末尾。"
  locale="zh"
  title="自定义触发控件与快捷键"
/>
