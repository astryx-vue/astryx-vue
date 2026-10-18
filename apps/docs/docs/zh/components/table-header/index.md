---
layout: component-docs
title: 表格表头
outline: false
footer: false
---

## 使用方法

`TableHeader` 是 children（自写结构）模式下包住 `<thead>` 的那一层，里面放表头行，行里的单元格用 `TableHeaderCell`。表头行必须放在一个分组里：`<table>` 不能直接套 `<tr>`，因为 HTML 解析器在解析服务端渲染的标记时会自动补一个 `<tbody>`，而客户端渲染不会补，两棵树对不上，水合（hydration）就会出错。用 `data` 驱动表格时，只要传了列，表格自己会渲染这一层；用 children 模式时，这一层要你自己写。

```ts
import { TableHeader } from '@astryx-vue/core/Table'
```
