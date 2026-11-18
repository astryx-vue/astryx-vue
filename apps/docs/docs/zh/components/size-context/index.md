---
layout: component-docs
title: 尺寸 Context
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { sizeContextOverview } from '../../../../components/demos/size-context'
</script>

## 使用方法

`SizeProvider` 用来给一整块子树统一定一个默认尺寸（`sm`、`md`、`lg`）。里面的交互组件没写 `size` 时，就用这一档；写了 `size` 的组件不受影响。它不渲染任何多余的元素，只把默认插槽原样透传。

```ts
import { SizeProvider, useSize, provideSize } from '@astryx-vue/core/SizeContext'
```

尺寸按下面的顺序决定，靠前的优先：

1. 组件上显式写的 `size`。
2. 只对 `Button` 生效：外层 `ButtonGroup` 的尺寸。
3. 外层 `SizeProvider` 或容器组件提供的 context。
4. 组件自己的默认值。

`Toolbar`、`ButtonGroup`、`InputGroup` 会自动把自己的尺寸往下提供，所以放在里面的组件不用再逐个写 `size`。`Button`、`MoreMenu`、`TextInput`、`TextArea`、`Selector`、`MultiSelector`、`NumberInput`、`DateInput` 这一族和 `TimeInput`、`SegmentedControl`、`TabList`、`PowerSearch`、`Tokenizer` 会读取它。

这份 context 和浮层一样有作用域：通过 Teleport 渲染到外面的浮层内容（菜单、弹出层等）不会继承外面的尺寸，在浮层里要自己再放一个 `SizeProvider`。

## 建议

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | 一整块区域要用同一档尺寸时，用 `SizeProvider` 或者 `Toolbar`、`InputGroup` 的 `size` 统一设置，不要给每个子组件重复写。 |
| <Badge variant="success">Do</Badge> | 只有个别组件需要例外时，直接在那个组件上写 `size`，它的优先级最高。 |
| <Badge variant="error">Don't</Badge> | 不要指望 `SizeProvider` 影响浮层里的内容：Teleport 出去的内容会重置回默认值。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="sizeContextOverview" title="SizeContext — SizeProvider" description="上面一行是默认尺寸，下面一行被 SizeProvider value=&quot;sm&quot; 包住，Button 和 TextInput 都变成小尺寸。" locale="zh" />
