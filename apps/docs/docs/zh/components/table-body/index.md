---
layout: component-docs
title: 表格主体
outline: false
footer: false
---

## 使用方法

`TableBody` 就是 children 模式里的 `<tbody>` 包装，数据行都放在它里面。行必须待在一个 section 里：`<table>` 不能直接套 `<tr>`，因为浏览器解析服务端渲染出来的 HTML 时会自动补一个隐含的 `<tbody>`，客户端渲染时却不会补，两边结构对不上，水合（hydration）就会报错。所以直接写进 `Table` 的行会出问题。用 `data={...}` 那套数据驱动模式时，这个元素由表格自己渲染；children 模式下就得你自己写。

```ts
import { TableBody } from '@astryx-vue/core/Table'
```
