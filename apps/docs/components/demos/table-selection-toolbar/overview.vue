<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { TableSelectionToolbar } from '@astryx-vue/core/Table'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}

// 无障碍名称和「清空」按钮文字来自内置文案，预览固定用英文。
</script>

<template>
  <TableSelectionToolbar :count="3" size="sm">
    <template #start>
      <Button label="Export" size="sm" variant="ghost" @click="demo('Export')" />
      <Button label="Delete" size="sm" variant="ghost" @click="demo('Delete')" />
    </template>
    <template #label="{ count }">
      {{ count }} rows picked
    </template>
  </TableSelectionToolbar>
</template>
