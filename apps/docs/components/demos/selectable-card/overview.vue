<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
import { SelectableCard } from '@astryx-vue/core/SelectableCard'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const selected = ref('pro')

function choose(id: string, next: boolean) {
  if (next)
    selected.value = id
}
</script>

<template>
  <HStack :gap="2">
    <SelectableCard
      :is-selected="selected === 'basic'"
      label="Basic"
      @update:is-selected="choose('basic', $event)"
    >
      <VStack :gap="1">
        <Heading :level="4">
          Basic
        </Heading>
        <Text type="supporting" weight="bold">
          $9/mo
        </Text>
      </VStack>
    </SelectableCard>
    <SelectableCard
      :is-selected="selected === 'pro'"
      label="Pro"
      @update:is-selected="choose('pro', $event)"
    >
      <VStack :gap="1">
        <Heading :level="4">
          Pro
        </Heading>
        <Text type="supporting" weight="bold">
          $29/mo
        </Text>
      </VStack>
    </SelectableCard>
  </HStack>
</template>
