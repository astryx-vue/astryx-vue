---
layout: component-docs
title: 表格页脚
outline: false
footer: false
---

## 使用方法

`TableFooter` 是 `<tfoot>` 的包装，只在「自己拼表格」的写法里用。它放在表格主体的下面，用来放汇总行或合计行。每一行都必须放在一个表格分区里：`<table>` 不能直接放 `<tr>`，因为 HTML 解析器碰到服务端渲染出来的标记时会自动补一个 `<tbody>`，而客户端渲染时 Vue 不会补，两边的结构对不上，水合（hydration）就会出问题。它只在这种自己拼的写法里有作用：交给 `data={...}` 的数据驱动写法只渲染表头和表体，永远不会渲染页脚。

```ts
import { TableFooter } from '@astryx-vue/core/Table'
```
