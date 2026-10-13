<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
import { SelectableCard } from '@astryx-vue/core/SelectableCard'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const plans = [
  { id: 'basic', name: 'Basic', price: '$9/mo', desc: 'For individuals' },
  { id: 'pro', name: 'Pro', price: '$29/mo', desc: 'For small teams' },
  { id: 'enterprise', name: 'Enterprise', price: '$99/mo', desc: 'For organizations' },
]

const selected = ref('pro')

function choose(id: string, next: boolean) {
  if (next)
    selected.value = id
}
</script>

<template>
  <HStack :gap="3">
    <SelectableCard
      v-for="plan in plans"
      :key="plan.id"
      :is-selected="selected === plan.id"
      :label="plan.name"
      :width="180"
      @update:is-selected="choose(plan.id, $event)"
    >
      <VStack :gap="1">
        <Heading :level="4">
          {{ plan.name }}
        </Heading>
        <Text type="large" weight="bold">
          {{ plan.price }}
        </Text>
        <Text color="secondary" type="supporting">
          {{ plan.desc }}
        </Text>
      </VStack>
    </SelectableCard>
  </HStack>
</template>
