<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { EmptyState } from '@astryx-vue/core/EmptyState'
</script>

<template>
  <EmptyState title="No results" description="Try a different search.">
    <template #icon>
      <span class="css-icon css-icon--lg i-carbon-search" />
    </template>
    <template #actions>
      <Button label="Clear filters" variant="secondary" />
    </template>
  </EmptyState>
</template>
