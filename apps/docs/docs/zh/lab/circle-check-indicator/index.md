---
title: CircleCheckIndicator
---

# CircleCheckIndicator

iOS 的多选标记：空心圆、带对勾的实心圆，或表示部分选中的带横线实心圆。它属于复选框家族的指示器：用 `defineTheme({ indicators })` 映射到 `checkbox` 后，所有 `CheckboxInput` 和 `CheckboxList` 都会画它。它只是装饰（`aria-hidden`），输入、角色、无障碍名称、焦点和键盘行为都由所属控件负责。颜色在任何指针下都按主题时长渐变，开启减弱动态效果时立刻切换。鼠标或触控笔按下时，按压色立刻画在圆圈上，松开后渐隐。属于 Lab，只通过 `canary` 标签发布。

<script setup lang="ts">
import { labCircleCheckIndicator } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labCircleCheckIndicator" description="主题把 checkbox 映射到 CircleCheckIndicator，这几个 CheckboxInput 就画成 iOS 的圆圈。" locale="zh" title="在主题里映射" /></ClientOnly>

## 引入

```ts
import { CircleCheckIndicator } from '@astryx-vue/lab'

const theme = defineTheme({
  name: 'circle-checks',
  indicators: { checkbox: CircleCheckIndicator },
})
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `state` | `'unchecked' \| 'checked' \| 'indeterminate'` | 必填 | 要画的状态。未选中时是空心圆环，不是什么都不画。 |
| `size` | `'sm' \| 'md'` | `'md'` | 控件尺寸。圆圈按 UIKit 的直径画：`sm` 18px，`md` 21.8px，居中放在宿主 20px 或 24px 的位置里。 |
| `isDisabled` | `boolean` | `false` | 画成禁用样式。只影响外观，禁用语义由所属控件负责。 |

## 插槽

| 名称 | 说明 |
| --- | --- |
| default | 画在圆圈里、代替标记的内容，比如 `CheckboxInput` 等待改动时传进来的加载圈。 |

## 最佳实践

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用 `defineTheme({ indicators: { checkbox: CircleCheckIndicator } })` 映射，`CheckboxInput` 和 `CheckboxList` 的语义和焦点环都还在。 |
| <Badge variant="success">推荐</Badge> | 只在面向 iOS 的主题里映射。它在任何平台上都画圆圈，而 Android 用方框表示多选。 |
| <Badge variant="success">推荐</Badge> | 旁边保留看得见的标签；圆圈只是装饰，什么也不播报。 |
| <Badge variant="error">避免</Badge> | 用它表示单选；单选该用单选框，或在选中的行上打勾，表示「其中之一」。 |
| <Badge variant="error">避免</Badge> | 给它加角色、标签或 Tab 停靠点；这些属于所属控件。 |
