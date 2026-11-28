<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core/Table'
import { Button } from '@astryx-vue/core/Button'
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { Popover } from '@astryx-vue/core/Popover'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Table, useTableColumnSettings, useTableColumnSettingsState } from '@astryx-vue/core/Table'
import { ref } from 'vue'

interface Member extends Record<string, unknown> {
  id: string
  name: string
  email: string
  role: string
}

const members: Member[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Engineer' },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'Designer' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'Manager' },
]

const allColumns: TableColumn<Member>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
]

const columnOptions = [
  { key: 'name', label: 'Name', isAlwaysVisible: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
]

const defaultKeys = ['name', 'email', 'role']
const activeKeys = ref<readonly string[]>(defaultKeys)

const state = useTableColumnSettingsState({
  columns: columnOptions,
  activeColumnKeys: activeKeys,
  onChangeActiveColumnKeys(keys) {
    activeKeys.value = keys
  },
  defaultColumnKeys: defaultKeys,
})
const plugin = useTableColumnSettings<Member>(state.columnSettingsConfig)
</script>

<template>
  <VStack :gap="3" width="100%">
    <HStack h-align="start">
      <Popover placement="below" label="Column settings" :width="200">
        <Button label="Columns" size="sm" />
        <template #content>
          <VStack :gap="2">
            <CheckboxInput
              v-for="column in columnOptions"
              :key="column.key"
              :label="column.label"
              :model-value="state.isColumnActive(column.key)"
              :is-disabled="!state.isColumnToggleable(column.key)"
              @update:model-value="state.toggleColumn(column.key)"
            />
            <Button label="Reset" size="sm" variant="secondary" @click="state.resetToDefault" />
          </VStack>
        </template>
      </Popover>
    </HStack>
    <Table :data="members" :columns="allColumns" id-key="id" :plugins="{ columnSettings: plugin }" />
  </VStack>
</template>
