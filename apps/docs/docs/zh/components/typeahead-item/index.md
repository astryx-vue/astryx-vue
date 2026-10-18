---
layout: component-docs
title: 自动补全项
outline: false
footer: false
---

<script setup lang="ts">
import { typeaheadItemBasic } from '../../../../components/demos/typeahead-item'
</script>

## 使用方法

自动补全下拉里默认的每一行长什么样：一行主文字，可以带图标、说明和头像。它被导出来，是为了在你自己画结果行的时候直接复用。

```ts
import { TypeaheadItem } from '@astryx-vue/core/Typeahead'
```

[自动补全](/components/typeahead) 的下拉本来就用它画每一行，所以大部分页面不用提到它。只有当这一行要多显示点东西时（比如职位、所属团队）才需要引进来：把 `TypeaheadItem` 放进 `Typeahead` 的 `item` 插槽（原版叫 `renderItem`），多出来的文字用 `description` 传进去。外面那层负责高亮、选中和键盘的壳还在，所以行照样能用方向键走、能按回车选。

不传 `description` 时，会画数据里的 `item.description`，所以数据本身就带说明的话，这个属性可以省掉。

## 示例

常见的用法和不同的状态。

<DemoExample :demo="typeaheadItemBasic" title="基础" description="下拉结果用 TypeaheadItem 来画，主文字下面多一行说明。原版放在 renderItem 里，让自定义结果长得和默认的一样。" locale="zh" />
