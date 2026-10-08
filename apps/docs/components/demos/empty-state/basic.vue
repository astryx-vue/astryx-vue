<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { EmptyState } from '@astryx-vue/core/EmptyState'
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
      <Button label="Clear filters" variant="secondary" />
      <Button label="Create item" variant="primary" />
    </template>
  </EmptyState>
</template>
