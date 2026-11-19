<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { OverflowList } from '@astryx-vue/core/OverflowList'

const items = [
  { id: 'edit', label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'share', label: 'Share' },
  { id: 'archive', label: 'Archive' },
  { id: 'delete', label: 'Delete' },
]
</script>

<template>
  <div class="overflow-list-overview">
    <OverflowList :items="items" :gap="2">
      <template #item="{ item }">
        <Button :label="item.label" size="sm" />
      </template>
      <template #overflow="{ items: hidden }">
        <Button :label="`+${hidden.length} more`" variant="ghost" size="sm" />
      </template>
    </OverflowList>
  </div>
</template>

<style scoped>
.overflow-list-overview {
  max-width: 400px;
  border: 1px dashed var(--astryx-color-border);
  padding: 8px;
}
</style>
