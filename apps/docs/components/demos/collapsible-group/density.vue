<script setup lang="ts">
import type { CollapsibleGroupDensity } from '@astryx-vue/core/Collapsible'
import { Collapsible, CollapsibleGroup } from '@astryx-vue/core/Collapsible'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const densities: Array<{ value: CollapsibleGroupDensity, label: string }> = [
  { value: 'compact', label: 'compact' },
  { value: 'balanced', label: 'balanced — the default' },
  { value: 'spacious', label: 'spacious' },
]

const sections = [
  { value: 'a', trigger: 'Region', body: 'Where your data is stored and processed. Changing region migrates existing data and can take up to an hour.' },
  { value: 'b', trigger: 'Retention', body: 'How long deleted items stay recoverable before being purged.' },
  { value: 'c', trigger: 'Audit log', body: 'Who can read the log, and how far back it reaches.' },
]
</script>

<template>
  <Stack :gap="5" :max-width="420">
    <Stack v-for="density in densities" :key="density.value" :gap="1">
      <Text type="supporting">
        {{ density.label }}
      </Text>
      <CollapsibleGroup type="single" has-dividers :density="density.value" default-value="a">
        <Collapsible v-for="section in sections" :key="section.value" :value="section.value">
          <template #trigger>
            <Text type="body" weight="semibold">
              {{ section.trigger }}
            </Text>
          </template>
          <Text type="body" color="secondary">
            {{ section.body }}
          </Text>
        </Collapsible>
      </CollapsibleGroup>
    </Stack>
  </Stack>
</template>
