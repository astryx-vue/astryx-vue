---
layout: component-docs
title: useCombobox
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useComboboxAssignTo } from '../../../../components/demos/use-combobox'
</script>

## 使用方法

组合框的交互逻辑：展开状态、高亮的选项、搜索过滤和键盘导航。它不渲染任何东西，输入框和列表由你自己写。高亮移动时会跳过禁用项，打开时会停在当前选中的值上。

```ts
import { useCombobox } from '@astryx-vue/core'
```

把选项和当前值作为 ref 传进去，再把 `onKeyDown` 绑到输入框上，用 `filteredOptions` 渲染列表。`activeIndex` 用来填 `aria-activedescendant`，选中某项时调用 `select(value)`；选中后列表会关闭，搜索词也会清空。

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 输入框加 `role="combobox"`、`aria-expanded` 和 `aria-activedescendant`，列表加 `role="listbox"`，每行用 `role="option"`。 |
| <Badge variant="success">推荐</Badge> | 在 `mousedown` 里选中并 `preventDefault`，输入框才不会失焦，blur 处理也不会抢在选中前把列表关掉。 |
| <Badge variant="error">避免</Badge> | 自己重写键盘处理。`onKeyDown` 已经覆盖方向键、Home、End、Enter、Escape 和按字母跳转。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useComboboxAssignTo"
  description="用 useCombobox 做的「指派给」字段：输入会过滤人名，方向键会跳过被禁用的名字，按 Enter 指派高亮的那个人。"
  locale="zh"
  title="useCombobox — 指派给字段"
/>
