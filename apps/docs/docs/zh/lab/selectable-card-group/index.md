---
title: SelectableCardGroup
---

# SelectableCardGroup

一组 `SelectableCard`，读出来就是它做的那种选择。单选是一个单选组：卡片是同名的原生单选框，整组只占一个 Tab 停靠点，方向键在卡片之间移动，读屏会说「第 2 项，共 3 项」。多选是一组带名字的复选框。单选组里的卡片只会选中；再选一次已选的卡片什么都不发生。属于 Lab，只通过 `canary` 标签发布。

<script setup lang="ts">
import { labSelectableCardGroup } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labSelectableCardGroup" description="三个方案选一个，卡片组成一个单选组。" locale="zh" title="单选" /></ClientOnly>

## 引入

```ts
import { SelectableCardGroup, SelectableCardGroupItem } from '@astryx-vue/lab'
```

## SelectableCardGroup 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | 必填 | 组的可见标签，也是组的无障碍名。 |
| `modelValue` | `string \| null \| string[]` | 必填 | 选中卡片的值，还没选时为 `null`。`selectionMode="multiple"` 时是选中值的数组。用 `v-model` 绑定。 |
| `selectionMode` | `'single' \| 'multiple'` | `'single'` | `single` 是单选组，`multiple` 是一组复选框。 |
| `description` | `string` | `undefined` | 标签下方的说明，和组关联。 |
| `isLabelHidden` | `boolean` | `false` | 视觉上隐藏标签，读屏仍然读得到。 |
| `htmlName` | `string` | 自动生成 | 表单提交这一组的值时用的名字。 |
| `isDisabled` | `boolean` | `false` | 禁用所有卡片。卡片仍可聚焦，并读出禁用。 |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | `horizontal` 让卡片按行换行排列，`vertical` 竖着叠放。 |

`class` 和 `style` 落在字段外壳上。其他属性落在组元素上，其中 `aria-labelledby` 和 `aria-describedby` 会加在标签和说明之外。

## SelectableCardGroupItem 属性

除了 `isSelected`（由组决定）之外，接受 `SelectableCard` 的全部属性。

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | 必填 | 这张卡片在组的 `modelValue` 里代表的值。 |
| `label` | `string` | 必填 | 卡片的无障碍名。 |
| `isDisabled` | `boolean` | `false` | 禁用这一张卡片。 |

## 事件

| 名称 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` / `change` | `string` 或 `string[]` | 新的选中值。`multiple` 下是新的数组，最新选的在最后。 |

## 最佳实践

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 卡片是「几个里选一个」时用它，比如套餐或配送方式。 |
| <Badge variant="success">推荐</Badge> | 每张卡片都给 `label`，它是原生单选框或复选框的名字。 |
| <Badge variant="error">避免</Badge> | 把单张 `SelectableCard` 放进没有组的列表来表示单选；它的复选框会让用户把选择清掉。 |
