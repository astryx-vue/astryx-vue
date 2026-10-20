---
layout: component-docs
title: useAnnounce
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

用一块视觉上隐藏的 live region，主动把一句话念给读屏软件听。只靠眼睛才能看出来的状态用它播报：搜索结果条数、"没有结果"、加载中和已保存的提示、校验错误（WCAG 4.1.3 状态消息）。polite 和 assertive 两块区域在第一次使用时以空内容创建，之后一直留在页面里，只换文字——这正是一次播报能被听到的原因：很多读屏软件会忽略和内容同时插入的 live region。每条消息播报完一两秒后会被清空，旧状态不会一直留在无障碍树里。

```ts
import { useAnnounce } from '@astryx-vue/core'
```

```ts
const announce = useAnnounce()

announce('找到 12 条结果')
announce('文件保存失败。', 'assertive')
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 需要播报时用它，不要自己搭一个 `aria-live` 的 div：区域和文字一起出现时，读屏通常不念。 |
| <Badge variant="success">推荐</Badge> | `"polite"` 留给状态和结果条数；`"assertive"` 留给错误和和时间有关的提醒，因为它会打断读屏正在念的内容。 |
| <Badge variant="success">推荐</Badge> | 播报结果，而不是操作；说 `"12 条结果"`，不要说 `"搜索跑了一次"`。 |
| <Badge variant="error">避免</Badge> | 播报 DOM 里已经看得见、标签也写对的内容；读屏用户会听到两遍。 |
