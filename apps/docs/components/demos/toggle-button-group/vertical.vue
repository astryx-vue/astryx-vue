<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { ref } from 'vue'

const view = ref<string | null>('grid')
const filters = ref<string[]>(['active'])
</script>

<template>
  <VStack :gap="4">
    <VStack :gap="1">
      <Text type="label" color="secondary">
        Single select
      </Text>
      <ToggleButtonGroup v-model:value="view" orientation="vertical" label="View mode">
        <ToggleButton value="list" label="List" />
        <ToggleButton value="grid" label="Grid" />
        <ToggleButton value="board" label="Board" />
      </ToggleButtonGroup>
    </VStack>
    <VStack :gap="1">
      <Text type="label" color="secondary">
        Multi select
      </Text>
      <ToggleButtonGroup v-model:value="filters" orientation="vertical" type="multiple" label="Status filters">
        <ToggleButton value="active" label="Active" />
        <ToggleButton value="pending" label="Pending" />
        <ToggleButton value="closed" label="Closed" />
      </ToggleButtonGroup>
    </VStack>
  </VStack>
</template>
