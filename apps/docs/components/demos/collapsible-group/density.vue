<script setup lang="ts">
import type { CollapsibleGroupDensity } from '@astryx-vue/core/Collapsible'
import { Collapsible, CollapsibleGroup } from '@astryx-vue/core/Collapsible'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const densities: Array<{ value: CollapsibleGroupDensity, label: string }> = [
  { value: 'compact', label: 'compact' },
  { value: 'balanced', label: 'balanced — the default' },
  { value: 'spacious', label: 'spacious' },
]
</script>

<template>
  <VStack :gap="6" width="100%">
    <VStack v-for="density in densities" :key="density.value" :gap="2">
      <Text color="secondary" type="label">
        {{ density.label }}
      </Text>
      <CollapsibleGroup :density="density.value" default-value="region" has-dividers type="single">
        <Collapsible trigger="Region" value="region">
          <Text color="secondary" type="body">
            Where your data is stored and processed. Changing region migrates existing data and can take up to an hour.
          </Text>
        </Collapsible>
        <Collapsible trigger="Retention" value="retention">
          <Text color="secondary" type="body">
            How long records are kept before they are deleted.
          </Text>
        </Collapsible>
        <Collapsible trigger="Audit log" value="audit">
          <Text color="secondary" type="body">
            Who changed a setting, and when.
          </Text>
        </Collapsible>
      </CollapsibleGroup>
    </VStack>
  </VStack>
</template>
