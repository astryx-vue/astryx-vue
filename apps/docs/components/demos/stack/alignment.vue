<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}

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
          <Button label="Cancel" size="sm" variant="secondary" @click="demo('Cancel')" />
          <Button label="Save" size="sm" variant="primary" @click="demo('Save')" />
        </HStack>
      </VStack>
    </Card>
  </VStack>
</template>
