---
layout: component-docs
title: 复选列表项
outline: false
footer: false
---

<script setup lang="ts">
import { checkboxListItemBasic } from '../../../../components/demos/checkbox-list-item'
</script>

## 使用方法

复选列表里的一行，有名字、说明，末尾还能再放点东西。它有两种用法：跟着 `CheckboxList` 一起用，勾选状态存在父组件的数组里；或者自己单独用，比如放进 `List`，或者放进一个没有绑数组的 `CheckboxList`，做「全选」那行。

```ts
import { CheckboxListItem } from '@astryx-vue/core/CheckboxList'
```

跟着 [复选列表](/components/checkbox-list) 用时，`value` 就是这一行的身份证，父组件靠它在数组里找这一行，漏写会直接报错。单独用时没有数组，就用 `isChecked` 决定勾不勾，勾选变化通过 `check` 事件告诉你。放在 [列表](/components/list) 里，或者做「全选」行，都是这种单独用法。

## 示例

常见的用法和不同的状态。

<DemoExample :demo="checkboxListItemBasic" title="基础" description="复选列表里的复选项，每行有名字和说明，状态跟着外面的数组走。适合通知偏好这类多选一组。" locale="zh" />
