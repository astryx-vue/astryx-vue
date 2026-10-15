---
layout: component-docs
title: 下拉菜单
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dropdownMenuActions, dropdownMenuAdaptive, dropdownMenuDisabled, dropdownMenuDrill, dropdownMenuIconTrigger, dropdownMenuRegions, dropdownMenuSections, dropdownMenuSelection, dropdownMenuSubmenu } from '../../../../components/demos/dropdown-menu'
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

数组里可以放动作、分隔线、带标题的分组，也可以放勾选行和单选组。动作行写出要做的事；勾选行带着当前是否选中；单选组带着当前选中的值，里面再列各个选项。这几类行也有各自的页面：[下拉菜单勾选项](/components/dropdown-menu-checkbox-item)、[下拉菜单单选组](/components/dropdown-menu-radio-group)、[下拉菜单单选项](/components/dropdown-menu-radio-item)。菜单要跟着页面状态变，或者想自己排版时，改用默认插槽写对应的行组件，两种写法画出来的结构一致。自己写行时，把内置图标放进图标插槽并传入图标名；数据数组里则传入一个图标组件，或一个 CSS 图标类。

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

需要外部控制开关时用双向绑定菜单的展开状态。菜单在挂载时就处于打开状态的话，不会抢走焦点——这不是用户要求的打开动作，把焦点从页面里拽走会让人丢失位置。

勾选行用来开关一项视图设置。点一下只翻转状态，菜单保持打开，方便连续改好几项。单选行必须放在单选组里，一组里一次只能选中一个；选完菜单收起，因为这次选择已经确定。方向键仍然在这些行之间移动，空格和回车会切换当前这一行。禁用的行留在菜单里，方向键会跳过它，点击也不会改变状态。勾选标记和单选圆点只是装饰，整行才是可操作的控件。粗指针设备上，标记会挪到行的末尾。

菜单上方和下方可以放不属于选项的内容，比如一个筛选框，或一个新建按钮。它们画在同一个框里，但不算菜单项：在里面打字不会按字母跳行。菜单本身是这一段里的一个 Tab 停靠点。从某一行按 Shift+Tab，会跳过菜单元素，落到上方最后一个可聚焦控件；从下方最后一个控件继续往后 Tab，或从上方第一个控件往前 Tab，菜单就会收起。用指针打开时，菜单上不会先画出焦点环；之后用键盘 Tab 到菜单上，焦点环才出现。

子菜单在宽屏上向旁边展开。在紧凑的触控界面上，同一级内容会换掉当前菜单里的行，并在顶部给出返回，返回文案会带上父级的名字。这个选择在菜单打开时定下来，打开期间不会再变。也可以强制始终旁边展开，或强制始终在原处替换。子菜单的行还在加载时，行尾的箭头可以换成转圈，菜单仍然能打开。飞出的面板默认至少大约 160 像素宽，也可以单独指定宽度，并且不会超出视口。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用动词开头的短句写动作名，让用户扫一眼就知道每一项会做什么。 |
| <Badge variant="success">推荐</Badge> | 动作超过五六项时用分组和分隔线把它们分簇，一簇里放同一类事情。 |
| <Badge variant="success">推荐</Badge> | 危险的动作用 `variant="destructive"` 标成错误色，并且放在菜单更靠下的位置。 |
| <Badge variant="success">推荐</Badge> | 需要提示快捷键时，把提示放进 `endContent` 插槽（通常是一个 `Kbd`），不要拼进 `label` 文本里。 |
| <Badge variant="success">推荐</Badge> | 视图开关用勾选行，并让菜单保持打开；互斥的一项选择用单选组，选完即收起。 |
| <Badge variant="success">推荐</Badge> | 筛选和新建这类不属于选项的控件放在菜单上方或下方，不要塞进行列里。 |
| <Badge variant="success">推荐</Badge> | 触发控件不是普通按钮时用触发器插槽，并把插槽给出的属性整份绑到控件上；只取其中一部分会让展开状态或控制关系丢掉，屏幕阅读器就不知道菜单开没开。 |
| <Badge variant="error">避免</Badge> | 用下拉菜单做页面导航。菜单是“做一件事”，导航该用导航组件。 |
| <Badge variant="error">避免</Badge> | 在同一个菜单里塞十几项而不分组。用户找不到东西，也会漏看后面的选项。 |
| <Badge variant="error">避免</Badge> | 把菜单当作表单。需要输入或选择多项时，用对话框或专门的表单控件。 |

## 示例

<DemoExample
  :demo="dropdownMenuActions"
  description="动作菜单用分隔线把日常操作和破坏性操作分开。选中一行后会记下最近一次动作。"
  locale="zh"
  title="动作"
/>

<DemoExample
  :demo="dropdownMenuAdaptive"
  description="紧凑的触控界面打开底部弹层，其他情况菜单仍锚在按钮旁边。"
  locale="zh"
  title="自适应呈现"
/>

<DemoExample
  :demo="dropdownMenuDisabled"
  description="当前用户不能执行的行保持禁用。"
  locale="zh"
  title="禁用项"
/>

<DemoExample
  :demo="dropdownMenuIconTrigger"
  description="只用一个图标按钮打开菜单，触发器上没有文字，也没有箭头。"
  locale="zh"
  title="图标触发"
/>

<DemoExample
  :demo="dropdownMenuSections"
  description="带标题的分组把行归在一起，菜单变长以后仍然好扫读。"
  locale="zh"
  title="分组"
/>

<DemoExample
  :demo="dropdownMenuSubmenu"
  description="悬停或按右方向键打开子菜单。左方向键或 Escape 关掉子菜单，焦点回到父行。"
  locale="zh"
  title="子菜单"
/>

<DemoExample
  :demo="dropdownMenuSelection"
  description="勾选行保持菜单打开，方便连续切换。单选组选中一项后收起，页面上的摘要跟着更新。"
  locale="zh"
  title="勾选与单选"
/>

<DemoExample
  :demo="dropdownMenuRegions"
  description="筛选框在菜单上方，新建按钮在下方。在筛选框里打字只会过滤标签，不会按字母跳到某一行。"
  locale="zh"
  title="页眉与页脚"
/>

<DemoExample
  :demo="dropdownMenuDrill"
  description="移动到会在同一个菜单里换成下一级，并带上一行返回。分享一行还在加载，箭头换成转圈。"
  locale="zh"
  title="钻入与加载"
/>
