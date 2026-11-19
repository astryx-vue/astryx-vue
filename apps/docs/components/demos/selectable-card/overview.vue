<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
import { SelectableCard } from '@astryx-vue/core/SelectableCard'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const plans = [
  { id: 'basic', name: 'Basic', price: '$9/mo', desc: 'For individuals' },
  { id: 'pro', name: 'Pro', price: '$29/mo', desc: 'For small teams' },
  { id: 'enterprise', name: 'Enterprise', price: '$99/mo', desc: 'For organizations' },
]

const selected = ref<string | null>('pro')
</script>

<template>
  <Stack direction="horizontal" :gap="3">
    <SelectableCard
      v-for="plan in plans"
      :key="plan.id"
      :label="plan.name"
      :is-selected="selected === plan.id"
      :width="180"
      @change="selected = plan.id"
    >
      <Stack direction="vertical" :gap="1">
        <Heading :level="4">
          {{ plan.name }}
        </Heading>
        <Text type="large" weight="bold">
          {{ plan.price }}
        </Text>
        <Text type="supporting" color="secondary">
          {{ plan.desc }}
        </Text>
      </Stack>
    </SelectableCard>
  </Stack>
</template>
