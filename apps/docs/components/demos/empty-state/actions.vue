<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { EmptyState } from '@astryx-vue/core/EmptyState'
import { Icon } from '@astryx-vue/core/Icon'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
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
      <Button label="Go back" variant="secondary" @click="demo('Go back')" />
      <Button label="Clear filters" variant="primary" @click="demo('Clear filters')" />
    </template>
  </EmptyState>
</template>
