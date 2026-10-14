<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Selector } from '@astryx-vue/core/Selector'
import { HStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const view = ref<string | undefined>('week')
const density = ref<string | undefined>('comfortable')
</script>

<template>
  <HStack align="center" :gap="2">
    <Button label="Today" variant="ghost" />
    <Selector
      v-model="view"
      label="Calendar view"
      is-label-hidden
      variant="ghost"
      :options="[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ]"
    />
    <Selector
      v-model="density"
      label="Density"
      is-label-hidden
      variant="ghost"
      status="warning"
      status-message="This setting affects all users"
      status-variant="tooltip"
      :options="[
        { value: 'compact', label: 'Compact' },
        { value: 'comfortable', label: 'Comfortable' },
        { value: 'spacious', label: 'Spacious' },
      ]"
    />
    <Button label="Export" variant="ghost" />
  </HStack>
</template>
