<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { EmptyState } from '@astryx-vue/core/EmptyState'
import { Icon } from '@astryx-vue/core/Icon'
</script>

<template>
  <EmptyState
    title="No results found"
    description="Try adjusting your search terms or clearing filters to see more results."
  >
    <template #icon>
      <Icon icon="i-heroicons-magnifying-glass" size="lg" />
    </template>
    <template #actions>
      <Button label="Go back" variant="secondary" />
      <Button label="Clear filters" variant="primary" />
    </template>
  </EmptyState>
</template>
