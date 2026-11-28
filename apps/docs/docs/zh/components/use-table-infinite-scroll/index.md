---
layout: component-docs
title: useTableInfiniteScroll
outline: false
footer: false
---

<script setup lang="ts">
import { useTableInfiniteScrollLoadMore } from '../../../../components/demos/use-table-infinite-scroll'
</script>

## 使用方法

返回一个 `TablePlugin`，用来一批一批地加载扁平数据。行、游标和错误提示都由你自己管：每来一批就追加到 `data`，再告诉插件还有没有下一批、现在是不是正在请求。只要 `hasMore` 为 true，表格下方就有一个「加载更多」按钮；表格末尾滚进视口时，会自动加载下一批。第一批还在加载时，表格不显示默认的空状态。

```ts
import { useTableInfiniteScroll } from '@astryx-vue/core/Table'
```

## 示例

<DemoExample
  :demo="useTableInfiniteScrollLoadMore"
  description="每批 8 行，一共 30 行。滚到表格末尾或者点「加载更多」都能加载；最后一批到了，按钮就消失。"
  locale="zh"
  title="useTableInfiniteScroll — 加载更多"
/>

## 建议

- `onLoadMore` 要返回这次请求的 Promise，请求期间让 `isLoading` 保持 true。不管是自动还是手动，同一时间只会有一个请求。
- 某一批失败时，错误提示由你自己显示。失败后自动加载会暂停，「加载更多」按钮还能用来重试，成功一次就恢复自动加载。
- 适合扁平列表。分组、树形或分页的表格，请用你自己的方式加载数据。
