<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { EmptyState } from '@astryx-vue/core/EmptyState'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <EmptyState
    title="No results found"
    description="Try adjusting your search terms, or clear the filters to see every item in this list."
  >
    <template #icon>
      <span class="css-icon css-icon--lg i-carbon-search" />
    </template>
    <template #actions>
      <Button label="Clear filters" variant="secondary" @click="demo('Clear filters')" />
      <Button label="Create item" variant="primary" @click="demo('Create item')" />
    </template>
  </EmptyState>
</template>
