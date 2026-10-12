<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { ref } from 'vue'

const view = ref<string | null>('grid')
const filters = ref(['active'])
</script>

<template>
  <VStack :gap="4">
    <VStack :gap="1">
      <Text color="secondary" type="label">
        Single select
      </Text>
      <ToggleButtonGroup v-model:value="view" label="View mode">
        <ToggleButton label="List" value="list" />
        <ToggleButton label="Grid" value="grid" />
        <ToggleButton label="Board" value="board" />
      </ToggleButtonGroup>
    </VStack>
    <VStack :gap="1">
      <Text color="secondary" type="label">
        Multi select
      </Text>
      <ToggleButtonGroup v-model:value="filters" label="Status filters" type="multiple">
        <ToggleButton label="Active" value="active" />
        <ToggleButton label="Pending" value="pending" />
        <ToggleButton label="Closed" value="closed" />
      </ToggleButtonGroup>
    </VStack>
  </VStack>
</template>
