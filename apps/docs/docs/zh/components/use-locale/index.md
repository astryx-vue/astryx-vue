---
layout: component-docs
title: useLocale
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useLocaleInvoiceSummary } from '../../../../components/demos/use-locale'
</script>

## 使用方法

读当前生效的 Astryx 语言标签。把它交给需要显式语言的纯格式化函数或同系列的包，别从 `navigator.language` 或者写死的字面量里另取一份。

```ts
import { useLocale } from '@astryx-vue/core/locale'
```

返回的 `locale` 是 computed 字符串，模板里会自动取值，`watch` 和 `computed` 也会跟着 provider 换语言而重算。标签在出口统一收过一次：`zh`、`zh-CN`、`zh-Hans` 都读作 `zh-CN`，其余标签保留地区、只规范大小写，例如 `en-gb` 读作 `en-GB`。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 把返回的语言标签交给纯 Astryx 函数，或交给需要显式语言的包。 |
| <Badge variant="error">避免</Badge> | 把 `navigator.language` 或写死的展示语言当兜底。语言只认 `InternationalizationProvider` 这一处来源。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useLocaleInvoiceSummary"
  description="账单摘要用 useLocale 拿到的语言交给 Intl 格式化日期和金额；把 provider 从英语切到德语，「Nov 2, 2026」和「$1,234.50」会变成「2. Nov. 2026」和「1.234,50 $」，不需要第二个语言来源。"
  locale="zh"
  title="useLocale — 账单摘要"
/>
