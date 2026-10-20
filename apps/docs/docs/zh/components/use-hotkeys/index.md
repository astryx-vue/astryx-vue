---
layout: component-docs
title: useHotkeys
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

注册全局快捷键。每个 hook 实例只在 window 上挂一个 `keydown` 监听。快捷键列表从一个 ref 或 getter 读，列表变化不会重新订阅。焦点在输入控件里（`input`、`textarea`、`select`、`contenteditable`）时默认不触发，除非这一条写了 `allowInInputs`；已经 `defaultPrevented` 的事件跳过，输入法组合中用到的键也跳过；命中时调用 `preventDefault()`。SSR 安全：监听只在挂载时装上。

```ts
import { useHotkeys } from '@astryx-vue/core'
```

监听在组件卸载时摘掉，列表变化时不会重挂。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用于应用级快捷键：命令面板（`mod+k`）、帮助浮层（`shift+/`）、导航键。 |
| <Badge variant="success">推荐</Badge> | 用 `Kbd` 组件把同一条组合显示出来；两边对 `mod` 的平台判断是同一套。 |
| <Badge variant="success">推荐</Badge> | 弹窗或向导占用键盘时，用 `isDisabled` 暂时停掉快捷键，而不是把 hook 卸掉。 |
| <Badge variant="error">避免</Badge> | 用它做控件内部的焦点导航；那种场景用 `useListFocus` 或 `useGridRovingFocus`。 |
