---
layout: component-docs
title: useCollator
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useCollatorNameSort } from '../../../../components/demos/use-collator'
</script>

## 使用方法

返回官方认可的、按语言比较字符串的比较器，供自定义排序使用。提供者语言变了，或者选项变了，比较器会重新创建。

```ts
import { useCollator } from '@astryx-vue/core/locale'
```

```ts
const collator = useCollator({ numeric: true })

const sorted = computed(() => [...items.value].sort((a, b) => collator.value.compare(a, b)))
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 在自定义的 Table 排序函数里、以及其他用户看得见的字符串排序里，复用 `collator.value.compare`。 |
| <Badge variant="error">避免</Badge> | 自己 `new Intl.Collator` 或者调 `localeCompare`；那会绕过「语言由提供者决定」这个约定。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useCollatorNameSort"
  description="用 useCollator 返回的比较器给一串姓名排序：带重音和小写开头的名字排在读者预期的位置；把 provider 的语言切成瑞典语，Å 和 Ö 会排到 Z 后面。"
  locale="zh"
  title="useCollator — 按语言排序姓名"
/>
