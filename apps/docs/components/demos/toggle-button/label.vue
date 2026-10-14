<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { ref } from 'vue'

const isVisible = ref(true)
const filters = ref<string[]>([])
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Standalone with label and icon
      </Text>
      <Stack align="center" direction="horizontal" :gap="3">
        <ToggleButton
          label="Visible"
          :is-pressed="isVisible"
          @update:is-pressed="isVisible = $event"
        >
          <template #icon>
            <Icon :icon="isVisible ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'" />
          </template>
          {{ isVisible ? 'Visible' : 'Hidden' }}
        </ToggleButton>
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Labeled group — filter toolbar
      </Text>
      <ToggleButtonGroup v-model:value="filters" type="multiple" label="Filters">
        <ToggleButton value="filter" label="Filter">
          <template #icon>
            <Icon icon="i-heroicons-funnel" />
          </template>
          Filter
        </ToggleButton>
        <ToggleButton value="nearby" label="Nearby">
          <template #icon>
            <Icon icon="i-heroicons-map-pin" />
          </template>
          Nearby
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  </Stack>
</template>
