---
layout: component-docs
title: useToast
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useToastShow } from '../../../../components/demos/use-toast'
</script>

## 使用方法

`useToast` 是一个在页面的任何地方都能随时呼叫的组合式函数，用来向用户弹出一句轻量、会自动消失的文字提示（Toast，又称轻提示），比如「保存成功」或「复制到剪贴板」。

它返回一个调用函数，只要传入提示内容和类型就能触发显示。所有的提示消息都统一保存在底层的全局状态里，所以在任何深层子组件里调用都管用。只需要在应用外层（或根组件）挂载一个 `<ToastViewport />`，提示就会整整齐齐地呈现在那里。

**什么时候用：**
- 用户完成某个操作后，给出短暂且不打扰人的成功反馈（如“更新成功”、“已发送”）。
- 轻微且不致命的操作错误提示。

**什么时候不要用：**
- 如果是不可逆的危险操作（如永久删除数据）或者需要用户仔细确认的报错，严禁使用 Toast，必须改用会锁屏确认的 [AlertDialog](/components/alert-dialog)。
- 如果提示需要用户驻足阅读并点击多个按钮处理，请改用对话框 [Dialog](/components/dialog) 或顶部常驻横幅。

```ts
import { useToast } from '@astryx-vue/core/Toast'
```

```vue
<script setup lang="ts">
import { ToastViewport, useToast } from '@astryx-vue/core/Toast'

const toast = useToast()
</script>

<template>
  <button type="button" @click="toast({ body: '文档已保存', type: 'success' })">
    弹出提示
  </button>
  <ToastViewport />
</template>
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用在不需要用户操作的短暂反馈上，例如成功和失败提示。 |
| <Badge variant="success">推荐</Badge> | 用户连点会重复弹的时候，用 `uniqueID` 去重。 |
| <Badge variant="success">推荐</Badge> | 在应用根部渲染一次 `ToastViewport`，让所有提示都有地方出现。 |
| <Badge variant="error">避免</Badge> | 需要用户确认的严重错误别用它；用 `AlertDialog`。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useToastShow"
  description="用 useToast 主动弹出轻提示，由 toast 视口负责渲染。"
  locale="zh"
  title="useToast — 弹出提示"
/>
