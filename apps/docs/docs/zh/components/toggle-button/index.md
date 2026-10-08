---
layout: component-docs
title: 切换按钮
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { toggleButtonBasic, toggleButtonGroup, toggleButtonIconOnly, toggleButtonStates } from '../../../../components/demos/toggle-button'
</script>

## 使用方法

`ToggleButton` 是一个带“按下 / 未按下”状态的按钮。它表示一个持续生效的选择，比如加粗、切换视图、收藏、开始录音，而不是一次性的动作。它复用 `Button` 的外观、尺寸和异步动作机制，只额外补上按下状态、`aria-pressed` 语义，以及按下时的图标与字重变化。

独立使用时，把按下状态绑到组件上即可：

```vue
<script setup lang="ts">
import { ToggleButton } from '@astryx-vue/core/ToggleButton'
import { shallowRef } from 'vue'

const isPinned = shallowRef(false)
</script>

<template>
  <ToggleButton v-model:is-pressed="isPinned" label="Pin to top" />
</template>
```

点击时组件先发出 `pressedChange` 事件（携带下一个状态和原始的点击事件），再写入 `v-model:is-pressed`。回调里调用 `event.preventDefault()` 就表示这次切换由你自己处理，组件不会改写状态，也不会运行 `pressedChangeAction`。如果完全不绑定按下状态，按钮会自己管理它。

按下状态需要等待接口或路由时，用 `pressedChangeAction` 代替手写 loading 状态。动作执行期间按钮显示下一个状态和一个加载指示，并且仍然可以点击：后一次点击会反转上一次尚未完成的选择，而不是被丢掉。

```vue
<script setup lang="ts">
import { ToggleButton } from '@astryx-vue/core/ToggleButton'
import { shallowRef } from 'vue'

const isShared = shallowRef(false)

async function shareWithTeam(next: boolean) {
  await api.setShared(boardId, next)
}
</script>

<template>
  <ToggleButton
    v-model:is-pressed="isShared"
    label="Share with team"
    :pressed-change-action="shareWithTeam"
  />
</template>
```

相关的开关应该放进 `ToggleButtonGroup`，让屏幕阅读器把它们读成一个整体：

```vue
<script setup lang="ts">
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { ref } from 'vue'

const view = ref<string | null | string[]>('board')
</script>

<template>
  <ToggleButtonGroup v-model:value="view" label="View mode">
    <ToggleButton value="list" label="List" />
    <ToggleButton value="board" label="Board" />
  </ToggleButtonGroup>
</template>
```

分组默认是单选：只有一个成员处于按下状态，再次点击当前项会取消选择（值为 `null`）。改成 `type="multiple"` 后每个成员各自开关，适合筛选器、列显示这类多选工具栏。分组的 `size` 会传给所有成员，成员自己设置 `size` 时以成员的为准；分组的 `isDisabled` 会禁用全部成员，而成员自己禁用自己时，分组无法把它重新启用。作为分组一员的按钮由分组决定按下状态，它自己的 `isPressed`、`pressedChange` 和 `pressedChangeAction` 都不再生效。

图标按钮请用 `isIconOnly`：按钮变成正方形，`label` 转为无障碍名称，鼠标悬停的文字提示由 `tooltip` 提供。按下时想换成实心图标，就把另一张图放进 `pressedIcon` 插槽；它留空时会退回 `icon`。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 按下状态用一个实心或带颜色的图标表示，例如麦克风换成实心方块，让用户一眼看出当前状态。 |
| <Badge variant="success">推荐</Badge> | 按下与未按下时保持标签文字不变，让背景、字重和图标去表达状态的差别。 |
| <Badge variant="success">推荐</Badge> | 把相关的开关放进带 `label` 的 `ToggleButtonGroup`，屏幕阅读器才会把它们播报成一组。 |
| <Badge variant="success">推荐</Badge> | 需要请求后端时用 `pressedChangeAction`，按钮会自动显示按下预览和加载指示，不必自己维护 loading 状态。 |
| <Badge variant="error">避免</Badge> | 用它做一次性的动作，例如“提交”“删除”，那些是 `Button` 的职责。 |
| <Badge variant="error">避免</Badge> | 在同一个 `ToggleButtonGroup` 里混用普通 `Button`，组内只应该放 `ToggleButton`。 |
| <Badge variant="error">避免</Badge> | 用它表示需要长期保存的开关设置，这类语义应该交给 `Switch`。 |

## 示例

<DemoExample
  :demo="toggleButtonBasic"
  description="一组视图切换按钮中有一项处于按下状态，右侧单独一个筛选开关展示按下时的背景与图标颜色变化。"
  locale="zh"
  title="基本用法"
/>

<DemoExample
  :demo="toggleButtonGroup"
  description="上面是单选的对齐方式，只能有一项生效，再次点击会取消选择；下面是多选的列显示，每一项独立开关。"
  locale="zh"
  title="单选与多选"
/>

<DemoExample
  :demo="toggleButtonIconOnly"
  description="纯图标工具栏依赖 label 作为无障碍名称、tooltip 作为悬停提示；录音开关在按下时把麦克风换成实心方块。"
  locale="zh"
  title="纯图标与图标切换"
/>

<DemoExample
  :demo="toggleButtonStates"
  description="三档尺寸、禁用与加载状态，以及一个由 pressedChangeAction 驱动的异步开关：动作未完成前按钮持续显示下一次点击的结果。"
  locale="zh"
  title="尺寸与状态"
/>
