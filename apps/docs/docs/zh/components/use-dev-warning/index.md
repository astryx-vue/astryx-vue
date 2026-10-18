---
layout: component-docs
title: useDevWarning
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

条件成立时打一条 `Component: message` 形式的控制台警告，只在开发构建里输出，每次挂载只打一次。组件想指出用法错误时用它最稳：同样的检查直接写在 `computed` 的取值函数或 `watch` 回调里，每次变化都会再跑一遍；用状态挡下来又多一次渲染。所以这里改成盯着条件，条件第一次成立时警告一次。组件之外要警告，用命令式的 `devWarn`。

```ts
import { useDevWarning } from '@astryx-vue/core'
```

`devWarn` 也从同一个入口拿出来：`import { devWarn } from '@astryx-vue/core'`。它不需要组件实例，输出同样的 `Component: message`，生产构建里同样会被整段去掉。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 先说清哪里错了，再说清应该怎么改。警告的全部价值就在这句话里。 |
| <Badge variant="success">推荐</Badge> | 用来提示类型表达不了的组合，例如两个互斥的 prop 同时给了值。 |
| <Badge variant="error">避免</Badge> | 拿它做用户看得见的提示，或当运行时报错用。生产构建里它会被去掉。 |
