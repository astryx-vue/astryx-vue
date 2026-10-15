---
layout: component-docs
title: 更多菜单
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { moreMenuBasic, moreMenuBottomSheet, moreMenuDividers, moreMenuSections } from '../../../../components/demos/more-menu'
</script>

## 使用方法

`MoreMenu` 是一个以 `⋯` 图标为触发器的溢出菜单，用来收纳那些不需要一直显示的操作：表格行、卡片标题、工具栏的次要动作。触发器本身只是一个纯图标按钮，动作都在它展开的菜单里。

菜单的内容由 `items` 数组描述。普通项就是一次操作，`type: 'divider'` 是一条分隔线，`type: 'section'` 是一个带标题的分组：

```vue
<script setup lang="ts">
import { MoreMenu } from '@astryx-vue/core/MoreMenu'

const items = [
  { label: 'Rename', onClick: () => rename() },
  { label: 'Duplicate', onClick: () => duplicate() },
  { type: 'divider' },
  { label: 'Move to trash', variant: 'destructive', onClick: () => remove() },
]
</script>

<template>
  <MoreMenu :items="items" label="File actions" />
</template>
```

触发器只有图标，所以 `label` 就是它的无障碍名称，同时也是菜单本身的名字，以及悬停时的提示文字。默认值 `More options` 在大多数界面里都够用；当菜单里装的是特定对象的操作时，换成更具体的说法（例如“项目操作”）会更好。想换掉三点图标，用 `icon` 插槽。

菜单打开的瞬间，焦点落在哪里取决于你是用什么方式打开的：键盘打开（在触发器上按 `Enter`、`Space`、`ArrowDown`、`ArrowUp`）落在第一项或最后一项上；鼠标点击打开则挂在菜单容器上，不预先高亮任何一行，避免看起来像是已经选中了什么。打开之后 `ArrowDown` 和 `ArrowUp` 在各项之间移动并首尾相接，`Home` 和 `End` 跳到首尾，输入字母会跳转到以该字母开头的下一项，`Enter` 和 `Space` 执行当前项，`Escape` 关闭并把焦点交回触发器，`Tab` 关闭菜单后让浏览器继续往后移动焦点。禁用项会被跳过，也不会进入键盘路径。

鼠标的按下与抬起是被区分的：按住鼠标时高亮跟着指针走，抬起的落点决定执行哪一项；如果抬起时指针在菜单之外，菜单就关闭。触摸设备上的行为不同——手指松开不会关闭菜单，因为高亮正在跟着手指移动，只有点中某一项、点中触发器或按下 `Escape` 才算结束。点开菜单时用的如果是鼠标，菜单与触发器之间的距离和方向由 `placement` 与 `alignment` 决定，空间不足时会自动翻到另一侧；溢出菜单通常希望 `alignment="end"`，让菜单和触发器的尾部对齐。

`presentation` 决定动作以什么形态出现：`popover`（默认）是锚定在触发器旁边的浮层；`bottom-sheet` 是从底部弹出的模态面板，适合手指操作；`adaptive` 在“主指针为粗略指针且宽度不超过 768px”时用底部面板，其余情况用浮层。底部面板里子菜单不是飞出的小面板，而是就地换一个视图，面板中间的标题会跟着变成该子菜单的名字，左上角出现返回按钮，`Escape` 先退出子菜单再关闭整个面板。

打开状态既可以由组件自己管理，也可以由你管理。传入 `isMenuOpen` 就进入受控模式，配合 `v-model:isMenuOpen` 使用；`openChange` 在每次请求打开或关闭时触发。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 只用来收纳次要操作。主要动作应该直接出现在界面上，藏进菜单会让人找不到。 |
| <Badge variant="success">推荐</Badge> | 项目多的时候用分隔线或分组整理：破坏性操作单独放在最后，并设为 `variant="destructive"`。 |
| <Badge variant="success">推荐</Badge> | 给每行图标都补上 `description`，让“导出”和“发布”这类相近的动作一眼能分清。 |
| <Badge variant="success">推荐</Badge> | 触发器位于表格行或工具栏末尾时，用 `alignment="end"` 让菜单与触发器的尾部对齐，避免菜单盖住内容。 |
| <Badge variant="success">推荐</Badge> | 移动端为主的界面用 `presentation="adaptive"`，手指能直接够到底部面板上的操作。 |
| <Badge variant="error">避免</Badge> | 把名称写得含糊，例如“更多”里再放一个“更多”。触发器需要一个能说清用途的 `label`。 |
| <Badge variant="error">避免</Badge> | 一次塞进十几个动作。超过一屏时用户要点开、滚动、再挑选，代价已经高于直接把操作摆出来。 |
| <Badge variant="error">避免</Badge> | 依赖菜单是否打开来保存数据或做导航。菜单是一个临时的浮层，状态应写在你的数据里。 |

## 示例

<DemoExample
  :demo="moreMenuBottomSheet"
  description="可见的溢出触发器，在底部动作条里打开操作。适合紧凑触屏上的短操作列表。"
  locale="zh"
  title="底部动作条"
/>

<DemoExample
  :demo="moreMenuBasic"
  description="基本的三点溢出菜单，条目只有文字。"
  locale="zh"
  title="默认"
/>

<DemoExample
  :demo="moreMenuDividers"
  description="三点菜单用分隔线把危险操作和安全操作分开。"
  locale="zh"
  title="带分隔线"
/>

<DemoExample
  :demo="moreMenuSections"
  description="三点菜单把操作放进带标题的分组。"
  locale="zh"
  title="带分组"
/>
