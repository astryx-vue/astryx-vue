---
layout: component-docs
title: 自动补全
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { typeaheadAsync, typeaheadStates, typeaheadStatic } from '../../../../components/demos/typeahead'
</script>

## 使用方法

`Typeahead` 是单选搜索框。输入框是 combobox，下拉列表是 listbox。本地数据用 `createStaticSource`，远程数据自己实现 `search`。

本地搜索按标签和可选关键词做子串匹配。`debounceMs` 设为 `0` 会立刻过滤：

```vue
<script setup lang="ts">
import { createStaticSource, Typeahead } from '@astryx-vue/core/Typeahead'
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

方向键移动高亮项，`Enter` 选中，`Escape` 关闭列表。焦点在输入框里时，`Home` 和 `End` 移动光标。选中后结果收成一枚可聚焦的词元，再次聚焦会回到搜索。

内置文案默认是英文。调用 `provideAstryxLocale('zh-CN')` 后改为中文。文档页会按当前语言自动提供。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 本地数据把 `debounceMs` 设为 0，远程请求保留默认防抖。 |
| <Badge variant="success">推荐</Badge> | 远程源在 `signal` 被取消时中止请求，避免过期结果覆盖新结果。 |
| <Badge variant="error">避免</Badge> | 用自动补全做多选。多选固定列表用多选器，多选搜索用标签输入。 |

## 示例

<DemoExample
  :demo="typeaheadStatic"
  description="本地数组按标签和关键词过滤。葡萄也可以用「提子」搜到。"
  locale="zh"
  title="静态搜索"
/>

<DemoExample
  :demo="typeaheadAsync"
  description="请求延迟 400 毫秒。输入「错误」会进入错误状态，加载中和没有结果也会出现在列表里。"
  locale="zh"
  title="异步搜索"
/>

<DemoExample
  :demo="typeaheadStates"
  description="带原因的禁用项仍然可以聚焦。错误状态在字段下方显示说明。"
  locale="zh"
  title="禁用和错误"
/>
