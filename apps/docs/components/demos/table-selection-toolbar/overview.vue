<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { TableSelectionToolbar } from '@astryx-vue/core/Table'

// 无障碍名称和「清空」按钮文字来自内置文案，预览固定用英文。
provideAstryxLocale('en')
</script>

<template>
  <TableSelectionToolbar :count="3" size="sm">
    <template #start>
      <Button label="Export" size="sm" variant="ghost" />
      <Button label="Delete" size="sm" variant="ghost" />
    </template>
    <template #label="{ count }">
      {{ count }} rows picked
    </template>
  </TableSelectionToolbar>
</template>
