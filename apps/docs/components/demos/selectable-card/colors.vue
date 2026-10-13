<script setup lang="ts">
import type { CardVariant } from '@astryx-vue/core/Card'
import { Grid } from '@astryx-vue/core/Grid'
import { SelectableCard } from '@astryx-vue/core/SelectableCard'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const tags: Array<{ id: string, name: string, variant: CardVariant }> = [
  { id: 'react', name: 'React', variant: 'blue' },
  { id: 'typescript', name: 'TypeScript', variant: 'cyan' },
  { id: 'node', name: 'Node.js', variant: 'green' },
  { id: 'python', name: 'Python', variant: 'yellow' },
  { id: 'rust', name: 'Rust', variant: 'orange' },
  { id: 'go', name: 'Go', variant: 'teal' },
]

const selected = ref(new Set(['react', 'typescript']))

function toggle(id: string, next: boolean) {
  const copy = new Set(selected.value)
  if (next)
    copy.add(id)
  else
    copy.delete(id)
  selected.value = copy
}
</script>

<template>
  <Grid :columns="3" :gap="2" :width="400">
    <SelectableCard
      v-for="tag in tags"
      :key="tag.id"
      :is-selected="selected.has(tag.id)"
      :label="tag.name"
      :variant="tag.variant"
      @update:is-selected="toggle(tag.id, $event)"
    >
      <Text type="body" weight="bold">
        {{ tag.name }}
      </Text>
    </SelectableCard>
  </Grid>
</template>
