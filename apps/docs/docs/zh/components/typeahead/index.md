---
layout: component-docs
title: 自动补全
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { typeaheadHelper, typeaheadLimited, typeaheadSearch, typeaheadValidation } from '../../../../components/demos/typeahead'
</script>

## 使用方法

`Typeahead` 是单选搜索框。输入框是 combobox，下拉列表是 listbox。本地数据用 `createStaticSource`，远程数据自己实现 `search`。

本地搜索按标签和可选关键词做子串匹配。`debounceMs` 设为 `0` 会立刻过滤：

```vue
<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { Typeahead } from '@astryx-vue/core/Typeahead'
import { ref } from 'vue'

const selected = ref(null)
const source = createStaticSource([
  { id: 'apple', label: '苹果' },
  { id: 'grape', label: '葡萄' },
], { keywords: item => item.id === 'grape' ? ['提子'] : [] })
</script>

<template>
  <Typeahead v-model="selected" :search-source="source" label="水果" :debounce-ms="0" show-on-focus />
</template>
```

异步数据源返回 Promise。`useAsyncSource` 会在输入停顿后发起请求，默认等待 150 毫秒。新的一次搜索会取消上一次，过期结果不会写回列表。空查询优先走 `bootstrap`。加载、没有结果、请求失败分别显示加载文案、空状态和错误文案。

方向键移动高亮项，`Enter` 选中，`Escape` 关闭列表。焦点在输入框里时，`Home` 和 `End` 移动光标。选中后结果收成一枚可聚焦的标签，再次聚焦会回到搜索。

内置文案默认是英文。调用 `provideAstryxLocale('zh-CN')` 后改为中文。文档页会按当前语言自动提供。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 本地数据把 `debounceMs` 设为 0，远程请求保留默认防抖。 |
| <Badge variant="success">推荐</Badge> | 远程源在 `signal` 被取消时中止请求，避免过期结果覆盖新结果。 |
| <Badge variant="error">避免</Badge> | 用自动补全做多选。多选固定列表用多选器，多选搜索用标签输入框。 |

## 示例

<DemoExample
  :demo="typeaheadLimited"
  description="下拉最多显示三条结果。"
  locale="zh"
  title="限制结果"
/>

<DemoExample
  :demo="typeaheadSearch"
  description="带搜索图标，聚焦后就给出建议。"
  locale="zh"
  title="搜索框"
/>

<DemoExample
  :demo="typeaheadHelper"
  description="标签下面有一段说明。"
  locale="zh"
  title="辅助说明"
/>

<DemoExample
  :demo="typeaheadValidation"
  description="用错误状态提示必须选择一个地点。"
  locale="zh"
  title="校验"
/>
