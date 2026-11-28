<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { Avatar } from '@astryx-vue/core/Avatar'
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { proportional, Table, useTableSelectionState } from '@astryx-vue/core/Table'
import { h, ref } from 'vue'

interface Person extends Record<string, unknown> {
  id: string
  name: string
  role: string
}

const people: Person[] = [
  { id: '1', name: 'Alice Chen', role: 'Engineer' },
  { id: '2', name: 'Bob Rivera', role: 'Designer' },
  { id: '3', name: 'Charlie Okafor', role: 'Manager' },
  { id: '4', name: 'Diana Petrov', role: 'Engineer' },
]

const selectedKeys = ref(new Set<string>())
const { selectionConfig } = useTableSelectionState<Person>({
  data: people,
  idKey: 'id',
  selectedKeys,
  setSelectedKeys(keys) {
    selectedKeys.value = keys
  },
})

// 没有单独的复选框列：勾选框占头像的位置，鼠标悬停、键盘聚焦或已经有行被选中时显示。
const columns: TableColumn<Person>[] = [
  {
    key: 'name',
    header: 'Name',
    width: proportional(2),
    renderCell: item => h('span', { class: ['leading-mark', { 'leading-mark--selecting': selectedKeys.value.size > 0 }] }, [
      h('span', { class: 'leading-mark__avatar' }, h(Avatar, { name: item.name, size: 'sm' })),
      h('span', { class: 'leading-mark__checkbox' }, h(CheckboxInput, {
        modelValue: selectionConfig.getIsItemSelected(item),
        label: `Select ${item.name}`,
        isLabelHidden: true,
        onChange: (value: boolean) => selectionConfig.onSelectItem({ item, isSelected: value }),
      })),
      item.name,
    ]),
  },
  { key: 'role', header: 'Role', width: proportional(1) },
]
</script>

<template>
  <Table :data="people" :columns="columns" id-key="id" />
</template>

<style>
.leading-mark {
  display: inline-flex;
  align-items: center;
  gap: var(--astryx-spacing-2, 8px);
}

.leading-mark__avatar,
.leading-mark__checkbox {
  display: inline-flex;
  inline-size: 32px;
  justify-content: center;
}

.leading-mark__checkbox {
  display: none;
}

.leading-mark:hover .leading-mark__avatar,
.leading-mark:focus-within .leading-mark__avatar,
.leading-mark--selecting .leading-mark__avatar {
  display: none;
}

.leading-mark:hover .leading-mark__checkbox,
.leading-mark:focus-within .leading-mark__checkbox,
.leading-mark--selecting .leading-mark__checkbox {
  display: inline-flex;
}
</style>
