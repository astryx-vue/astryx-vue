---
layout: component-docs
title: 表格选择工具栏
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

`TableSelectionToolbar` 是配合「勾选行」用的批量操作条。`useTableSelectionState` 返回两份东西，分别交给对应的使用者：`selectionConfig` 交给 `useTableSelection`，`selectionState` 交给这条工具栏。工具栏从这份状态里读条数，并负责清空全部选中的键，所以永远跟勾选框对得上。老写法传 `count` 并自己处理 `clear` 也照样能用。

自己的操作按钮放进 `start` 插槽，计数文字和清空按钮由工具栏负责，排在末端。这条本身不管表格布局，也不管吸顶：放在表格上方跟着正常流排，或者用 `class`、`style` 自己固定住。

```ts
import { TableSelectionToolbar } from '@astryx-vue/core/Table'
```

<ComponentAnatomy />

## 跨服务端分页选中全部匹配行

行一页一页从服务端加载时，应用可以把选择记成「所有匹配的行，减去被取消勾选的那些」，这样还没加载的页上的行也算选中。表格和工具栏只负责显示：传你自己的 `TableSelectionState` 和自己的计数，不用 `useTableSelectionState` 给的那份。

```ts
const isAllMatching = ref(false)
const picked = ref(new Set<string>()) // 一行行勾上的
const excluded = ref(new Set<string>()) // 全选模式下取消勾选的

const isSelected = (row: User) => isAllMatching.value ? !excluded.value.has(row.id) : picked.value.has(row.id)
const isPageSelected = computed(() => pageRows.value.every(isSelected))
const selectedCount = computed(() => isAllMatching.value ? total.value - excluded.value.size : picked.value.size)

const selectionPlugin = useTableSelection<User>(() => ({
  getIsItemSelected: isSelected,
  // setRows 在全选模式下改 excluded，否则改 picked。
  onSelectItem: ({ item, isSelected }) => setRows([item], isSelected),
  onSelectAll: ({ isAllSelected }) => setRows(pageRows.value, isAllSelected),
  getIsAllSelected: () => isPageSelected.value,
}))

const selection = computed<TableSelectionState>(() => ({
  // 只有已加载的行：全部的键不在客户端。
  selectedKeys: new Set(pageRows.value.filter(isSelected).map(row => row.id)),
  selectedCount: selectedCount.value,
  hasSelection: selectedCount.value > 0,
  clearSelection: () => {
    isAllMatching.value = false
    picked.value = new Set()
    excluded.value = new Set()
  },
}))
```

```vue
<TableSelectionToolbar :selection="selection">
  <template #start>
    <Button label="归档" variant="ghost" @click="archive" />
    <!-- 放在操作旁边，不占它的位置。用过之后它变成撤销自己的命令，焦点留在它上面，
         再按一次也不会触发归档。 -->
    <Button
      v-if="isAllMatching || isPageSelected"
      :label="isAllMatching ? '只选本页' : `选中全部 ${total} 条匹配`"
      variant="ghost"
      @click="toggleAllMatching"
    />
  </template>
</TableSelectionToolbar>
```

「只选本页」会选中本页的每一行，所以按钮文字始终属实，获得焦点的按钮也不会被卸掉。执行批量操作时，把查询条件和被排除的 id 发给服务端，不要发选中 id 的列表。

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 直接把 `useTableSelectionState` 返回的 `selectionState` 传进来，选中数字和清空命令才会跟行勾选保持同步。 |
| <Badge variant="success">推荐</Badge> | 产品自己的操作放进 `start` 插槽，不要把它们编码成一串配置对象。 |
| <Badge variant="error">避免</Badge> | 通过 Table 插件或它的横向滚动容器把这个工具栏塞进去。 |
