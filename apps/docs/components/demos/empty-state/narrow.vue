<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { EmptyState } from '@astryx-vue/core/EmptyState'
</script>

<template>
  <div class="empty-state-preview__stack">
    <div class="empty-state-preview__panel empty-state-preview__panel--narrow">
      <EmptyState
        title="No messages match these filters"
        description="Every conversation from the last 30 days is included. Widen the date range or clear the sender filter to see more."
      >
        <template #actions>
          <Button label="Widen range" variant="secondary" size="sm" />
          <Button label="Clear filters" variant="secondary" size="sm" />
        </template>
      </EmptyState>
    </div>
    <span class="empty-state-preview__caption">Text and actions wrap inside a narrow column instead of overflowing it.</span>
  </div>
</template>
