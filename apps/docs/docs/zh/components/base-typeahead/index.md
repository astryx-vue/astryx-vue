---
layout: component-docs
title: 基础自动补全
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { baseTypeaheadCustomResults } from '../../../../components/demos/base-typeahead'
</script>

## 使用方法

组合框的引擎：一个光板输入框，加上搜索、键盘操作和画好的结果下拉。它不画输入框外壳、不画边框，也不画已选值。`Typeahead` 和 `Tokenizer` 都是在它上面拼出来的标准字段。

```ts
import { BaseTypeahead } from '@astryx-vue/core/Typeahead'
```

这版的分工和原版一样。`BaseTypeahead` 只管输入框、搜索源、键盘模型和下拉；标签、说明、状态文案、已选值的标签都归调用方，由调用方摆在引擎外面。这里的 `label` 只是输入框的无障碍名，外面已经有 `<label for>` 指过来时就不用传。

<ComponentAnatomy />

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 标准表单字段直接用 `Typeahead` 或 `Tokenizer`。它们包着 `BaseTypeahead`，把原版故意不画的外壳和已选值都补上了。 |
| <Badge variant="success">推荐</Badge> | 自己给一个看得见的标签或者 `aria-label`，再自己套一层输入框外壳，让这个光板组合框有无障碍名、有聚焦样式、有边框、有布局。 |
| <Badge variant="success">推荐</Badge> | 把你的外壳元素通过 `anchorRef` 传进去，下拉就会贴着你的外壳定位，而不是只贴那个光板输入框。 |
| <Badge variant="error">避免</Badge> | 别指望它画外壳或者画已选值。`BaseTypeahead` 只是引擎，外面那些看得见的东西都是调用方的事。 |
| <Badge variant="error">避免</Badge> | `Typeahead` 或 `Tokenizer` 够用时就不要用 `BaseTypeahead`。多套一层外壳、多写一套样式，只有真要做非常规组合时才值得。 |
| <Badge variant="error">避免</Badge> | 别以为按 Escape 就把还在跑的搜索取消了。它只是把当前弹层藏起来，晚到的结果还能把弹层重新打开。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="baseTypeaheadCustomResults" title="BaseTypeahead" description="自己画每一行结果，多给一条旁注，而选中语义和键盘行为仍然由 BaseTypeahead 负责。" locale="zh" />
