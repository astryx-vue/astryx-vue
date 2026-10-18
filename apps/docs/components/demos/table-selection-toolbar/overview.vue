<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { TableSelectionToolbar } from '@astryx-vue/core/Table'

// 条上的计数和「Unselect All」来自内置文案，预览固定用英文。
provideAstryxLocale('en')
</script>

<template>
  <TableSelectionToolbar :count="3">
    <Button label="Export" variant="ghost" />
    <Button label="Delete" variant="ghost" />
  </TableSelectionToolbar>
</template>
