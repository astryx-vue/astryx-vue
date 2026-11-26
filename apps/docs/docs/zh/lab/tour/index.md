---
title: Tour
---

# Tour

Tour 用一串指向页面元素的引导步骤介绍功能。`Tour` 管理当前步骤，`TourStep` 负责目标高亮和说明弹层，`useTour` 让自定义步骤读取同一套状态。它属于 Lab，只通过 `canary` 标签发布。

<script setup lang="ts">
import { labTour } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labTour" description="启动后依次介绍三个操作。用 Next、Back、Done、关闭按钮或 Escape 完成流程。" locale="zh" title="基本用法" /></ClientOnly>

## 导入

```ts
import { Tour, TourStep, useTour } from '@astryx-vue/lab'
```

## 启动与关闭

`isActive` 由调用方控制。组件不会自己持久化“用户已经看过”，也不会在 `dismiss` 后擅自改写 `isActive`。调用方应在回调里关闭，并按原因保存进度：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const active = ref(false)
function dismiss(source) {
  active.value = false
  // complete 表示走完；backdrop、close、escape 表示提前离开。
}
</script>
```

关闭后再次激活会回到第一步。`backdrop` 来自在压暗的页面上按一下（包括按目标），`close` 来自步骤的关闭按钮，`escape` 来自 Escape 键，`complete` 来自最后一步的 Done。自定义 UI 也可以通过 `useTour().dismiss('skip')` 跳过。

## Tour 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `isActive` | `boolean` | 必填 | 是否运行。关闭时不渲染步骤，并重置到第一步。 |
| `hasBackdrop` | `boolean` | `false` | 压暗目标周围页面，保留目标亮区；这时在说明框外按任何地方（包括目标）都会以 `backdrop` 结束引导。关闭时只显示高亮环，用户可以去按步骤介绍的那个控件。 |
| `isStepCountShown` | `boolean` | `false` | 显示当前步骤和总步数，例如 `2 of 3`。 |

`dismiss` 事件携带 `TourDismissSource`。步骤顺序由 `TourStep` 子组件的顺序决定，不需要另传步骤数组。

每一步的说明框是一个以标题命名的非模态区域。步骤开始时焦点移到说明框，Tab 可以离开它回到页面，所以一步可以先介绍一个控件，再让用户自己去操作。引导结束时，目标能拿焦点就把焦点还给目标，否则还给开始引导时有焦点的元素。

## TourStep 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `targetRef` | `MaybeRef<HTMLElement \| null>` | 必填 | 指向目标的模板 ref，也接受元素本身。可以是任何元素：按钮、卡片、表格单元格、图表区域都行。目标保持自己的行为：没有遮罩时按它不会结束引导。 |
| `heading` | `string` | 必填 | 步骤标题，同时是弹层的无障碍名称。 |
| `placement` | `'above' \| 'below' \| 'start' \| 'end'` | `'below'` | 说明框位于目标的哪一侧，空间不足时自动翻到另一侧。 |
| `alignment` | `'start' \| 'center' \| 'end'` | `'start'` | 沿该侧的对齐方式。 |

默认插槽放正文。高亮画在独立元素上，不会改写目标的 class 或样式；滚动和窗口尺寸变化时重新测量。

## useTour

在 `Tour` 内调用 `useTour()` 可读取 `activeStepIndex`、`stepCount`、`isFirstStep`、`isLastStep`，并调用 `next()`、`previous()`、`dismiss(source)`。没有 `Tour` 时返回 `null`。
