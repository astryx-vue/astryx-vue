<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const rows = [
  { label: 'Start (left)', align: 'start' },
  { label: 'Center', align: 'center' },
  { label: 'End (right)', align: 'end' },
] as const
</script>

<template>
  <VStack :gap="3" width="100%" style="max-width: 500px">
    <Card v-for="row in rows" :key="row.label" :padding="4">
      <VStack :gap="4">
        <Text color="secondary" type="supporting">
          {{ row.label }}
        </Text>
        <HStack :gap="1" :h-align="row.align">
          <Button label="Cancel" size="sm" variant="secondary" />
          <Button label="Save" size="sm" variant="primary" />
        </HStack>
      </VStack>
    </Card>
  </VStack>
</template>
