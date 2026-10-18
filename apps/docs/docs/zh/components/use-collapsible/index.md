---
layout: component-docs
title: useCollapsible
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useCollapsibleCustom } from '../../../../components/demos/use-collapsible'
</script>

## 使用方法

可复用的组合式函数，封装了折叠面板的状态机。支持三种模式：组管理（在 `CollapsibleGroup` 里）、受控（`isOpen` + `onOpenChange`）、不受控（用 `defaultIsOpen` 自己管）。`Collapsible` 组件内部也用它。

```ts
import { useCollapsible } from '@astryx-vue/core/Collapsible'
```

在 `setup()` 里调用，读 `isOpen` / `isEnabled`，或者把 `isOpen` 绑到 `v-show`。hook 只管状态，触发器长什么样由你决定。

```vue
<script setup lang="ts">
import { useCollapsible } from '@astryx-vue/core/Collapsible'

const { isOpen, toggle } = useCollapsible({ isCollapsible: true })
</script>

<template>
  <button type="button" :aria-expanded="isOpen" @click="toggle">
    Details
  </button>
  <div v-show="isOpen">
    Hidden while collapsed.
  </div>
</template>
```

要做受控，就给 `isCollapsible` 传一个对象。`isOpen` 就是那个 model ref，平时是 `v-model:isOpen`：

```ts
const isOpen = ref<boolean | undefined>(false)
const collapsible = useCollapsible({
  isCollapsible: { isOpen, onOpenChange: (next) => { isOpen.value = next } },
})
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">Do</Badge> | 要自己搭折叠组件、又想要 Astryx 的折叠行为时，直接用这个 hook，不必套 `Collapsible` 外壳。 |
| <Badge variant="success">Do</Badge> | 要做手风琴，就把各项放进 `CollapsibleGroup`，并给每项一个唯一的 `value`。 |
| <Badge variant="error">Don't</Badge> | 不要指望在 `value` 绑定了组的那一项上，本地的 `isOpen`、`defaultIsOpen`、`onOpenChange` 还会生效；那份状态和通知路径归组所有。 |
| <Badge variant="error">Don't</Badge> | `useCollapsible` 已经给了开合状态，就不要再自己写一套；组内的协调它已经处理好了。 |

## 示例

用 `useCollapsible` 直接搭一个自定义折叠界面，开关状态完全由 hook 提供。

<DemoExample
  :demo="useCollapsibleCustom"
  description="用 useCollapsible 直接搭自定义折叠界面，开关状态完全由 hook 提供。"
  locale="zh"
  title="useCollapsible — Custom Disclosure"
/>
