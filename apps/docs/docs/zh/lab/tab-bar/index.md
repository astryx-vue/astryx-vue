---
title: TabBar
---

# TabBar

手机应用底部的标签栏，照着 iOS 26 做：应用的几个顶层分区排成一颗浮在底边上方的胶囊，选中的标签下面垫着一块「透镜」，选别的标签时它滑过去。每个标签有图标、名字，还可以带一个角标。

用手指操作时（iOS 和 Android 一样），手感和 iOS 26 一致：手指一碰，透镜像玻璃一样抬起来，胶囊轻轻弹一下；手指在栏上拖，透镜跟着走；松手时落到离手指最近的标签上。用鼠标时就是普通按钮：点一下选中，透镜按主题的动效节奏滑过去。没有选中的标签时，按住哪个标签哪个就亮起底色。再次选中已选的标签会把它的面板滚回顶部，并单独通知你，方便像 iOS 那样把这个分区退回首页。标签超过五个时，栏里显示前四个和一个「更多」，其余的交给 `TabBarMoreList` 列出来。

<script setup lang="ts">
import { labTabBar } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labTabBar" description="六个分区：栏里显示前四个和「更多」，「更多」里列出剩下两个。Inbox 带角标；再点一次已选的标签，内容滚回顶部。在手机上可以按住胶囊左右拖。" locale="zh" title="六个分区" /></ClientOnly>

## 导入

```ts
import { TabBar, TabBarItem, TabBarMoreList } from '@astryx-vue/lab'
```

## 结构

选中的标签由你保管：用 `v-model` 绑定选中标签的 `value`。标签按顺序写成 `TabBarItem`，它自己不渲染，只是把标签的信息交给 TabBar。

```vue
<script setup lang="ts">
const selected = ref('home')
</script>

<template>
  <TabBar v-model="selected" label="分区" @reselect="backToRoot">
    <TabBarItem value="home" label="首页" icon="i-heroicons-home" selected-icon="i-heroicons-home-solid" panel-id="home-panel" />
    <TabBarItem value="inbox" label="收件箱" icon="i-heroicons-inbox" :badge="3" badge-label="3 条未读" panel-id="inbox-panel" />
    <TabBarItem value="profile" label="我" icon="i-heroicons-user" panel-id="profile-panel" />
  </TabBar>
</template>
```

栏固定在视口底部、盖在页面上面，所以滚动内容底部要留出 83px，并在 `LayerProvider` 上声明这段底部留白（`:inset="{ blockEnd: 83 }"`），让菜单、弹出层和提示条避开它。

## 动效

| 动作 | 效果 |
| --- | --- |
| 手指按下 | 透镜朝手指走过去并抬起：外扩、变成玻璃、里面的图标放大；胶囊跟着弹一下。 |
| 手指拖动 | 透镜紧紧跟着手指，拖过第一个或最后一个标签时像橡皮筋一样收住。 |
| 手指松开 | 选中离手指最近的标签，透镜落到它上面，抬起和弹性一起回落。手指滑出栏外再松手，透镜回到原来的标签，什么都不选。 |
| 按键或代码改选中 | 透镜从原来的位置滑到新标签上。 |
| 鼠标点击 | 透镜按主题的 `--astryx-duration-medium` 和 `--astryx-ease-standard` 滑过去。 |
| 没有选中时按住 | 手指下的标签立刻上底色，松手后按主题的退出时长淡出。 |
| 减少动态效果 | 不缩放：手指下的透镜直接放到手指处，抬起的样子立刻出现、松手时淡出；按键或代码改的选中变成淡入淡出，鼠标点击时透镜直接跳过去。按住的底色淡出不超过 200ms。 |

所有弹簧（透镜走动、跟手、落位、抬起、胶囊弹性）的参数都照 iOS 26.2 实测值。

## 禁用的标签

和 core 的 `Tab` 一样，禁用的标签仍能聚焦，只是变暗、永远不会被选中：点它、按键、在它上面松手都不选它，方向键会跳过它。手指落在它上面时透镜不动，等手指拖起来或滑到可用的标签上才抬起，松手就选那个标签。这里有意和 iOS 不同：iOS 直接忽略从禁用标签开始的触摸，TabBar 遵循「松手在哪就作用在哪」。

## 「更多」标签

超过五个标签时，栏里显示前四个和「更多」。选「更多」时 `v-model` 变成 `moreValue`（默认 `'more'`）；选中值是 `moreValue` 或第四个之后的任何标签时，「更多」都显示为选中。选中值是 `moreValue` 时渲染 `TabBarMoreList`，在里面选的分区放进「更多」自己的导航栈里显示。

## TabBar

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | 必填 | 选中标签的 `value`。配合 `v-model` 使用。 |
| `label` | `string` | `undefined` | 标签栏的无障碍名称。不给它和 `ariaLabel`、`ariaLabelledby` 时，按读屏语言叫「标签页」。 |
| `ariaLabel` | `string` | `undefined` | 给标签列表命名，优先于 `label`。 |
| `ariaLabelledby` | `string` | `undefined` | 用另一个元素给标签列表命名，优先于前两者。 |
| `moreValue` | `string` | `'more'` | 标签超过五个时「更多」标签的值。 |

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(value: string)` | 选了另一个标签：手指在它上面松开（点按或拖过栏）、鼠标点击，或者在聚焦的标签上按 Enter、空格。 |
| `change` | `(value: string)` | 和 `update:modelValue` 同时触发。 |
| `reselect` | `(value: string)` | 再次选中已选的标签，比如把这个分区的导航栈退回根。每次都会把它的面板（`panelId`）滚回顶部。「更多」里选着某个标签时再点「更多」，也是 `reselect`，用来回到列表。 |

| 插槽 | 说明 |
| --- | --- |
| `default` | 标签：按顺序放 `TabBarItem`。 |

## TabBarItem

一个标签。TabBar 读它的属性来画，它自己什么都不渲染。

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | 必填 | 在 `modelValue`、`change` 和 `reselect` 里代表这个标签。 |
| `label` | `string` | 必填 | 标签名，显示在图标下面，最好是一个短词。 |
| `icon` | `string \| Component \| () => VNode` | `undefined` | 标签的图标：图标名、CSS 图标类、组件或渲染函数。用当前文字颜色画，选中时用强调色。 |
| `selectedIcon` | 同 `icon` | `icon` | 选中时的图标，一般是实心版。 |
| `badge` | `string \| number` | `undefined` | 图标右上角的角标：数字或像「!」这样的短字符串。出现、变化和消失都不带动画。不传或传空字符串就没有角标。 |
| `badgeLabel` | `string` | 角标本身 | 读屏在标签名后念的角标内容，比如「3 条未读」。 |
| `panelId` | `string` | `undefined` | 这个标签控制的面板 id，写成 `aria-controls`。再次选中这个标签时面板滚回顶部：面板自己能滚就滚它，否则滚面板里第一个上下滚动的区域。 |
| `disabled` | `boolean` | `false` | 禁用这个标签，见上文。 |

## TabBarMoreList

「更多」标签的那一屏，照着 iOS 做：第四个之后的每个标签占一行，带图标、名字、角标和一个指向里面的箭头。给它和 TabBar 一样的 `TabBarItem`；禁用的标签在这里也是禁用的。iOS 里调整标签顺序的「编辑」暂时还没有。

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `undefined` | 选中标签的值，它那一行显示为选中。配合 `v-model` 使用。 |

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(value: string)` | 选了一行：在「更多」里显示那个分区，栏里仍然选着「更多」。 |
| `change` | `(value: string)` | 和 `update:modelValue` 同时触发。 |

| 插槽 | 说明 |
| --- | --- |
| `default` | 和交给 TabBar 的同一组 `TabBarItem`。 |

## 使用建议

- 用来在手机上切换应用的三到五个顶层分区，每个分区保留自己的状态和导航栈；在 `reselect` 里把分区的导航栈退回根。
- 标签全部可见、数量稳定；名字要短，图标用线框版，`selectedIcon` 用实心版。
- 尽量不超过五个；超过时把最常用的放前面，其余的会进「更多」。
- 角标用来提示这个分区里需要注意的东西，比如未读数，并在 `badgeLabel` 里说清楚数的是什么。
- 给每个标签一个 `panelId` 指向它的面板，并把分区内容放在面板里的滚动区里，这样再点一次就能滚回顶部。
- 只在分区暂时打不开时禁用标签，并让它留在原位，免得别的标签挪位置。
- 不要用它放操作按钮、做同一屏里的筛选（用 `SegmentedControl`）或页面里的选项卡（用 `TabList`）。
