<script setup lang="ts">
import { Grid } from '@astryx-vue/core/Grid'
import { SelectableCard } from '@astryx-vue/core/SelectableCard'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const plans = [
  { id: 'starter', name: 'Starter' },
  { id: 'pro', name: 'Pro' },
]

const selected = ref('pro')

function choose(id: string, next: boolean) {
  if (next)
    selected.value = id
}
</script>

<template>
  <Grid :columns="2" :gap="3" :width="420">
    <SelectableCard
      v-for="plan in plans"
      :key="plan.id"
      elevation="low"
      :is-selected="selected === plan.id"
      :label="plan.name"
      @update:is-selected="choose(plan.id, $event)"
    >
      <Text type="body" weight="bold">
        {{ plan.name }}
      </Text>
      <Text color="secondary" type="supporting">
        The resting shadow stays put — the selection ring layers on top.
      </Text>
    </SelectableCard>
  </Grid>
</template>
