<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Divider } from '@astryx-vue/core/Divider'
import { Section } from '@astryx-vue/core/Section'
import { HStack, StackItem, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const metrics = [
  { label: 'Revenue', value: '$24,500', delta: '+12% vs last month' },
  { label: 'Users', value: '1,240', delta: '+8% vs last month' },
  { label: 'Conversion', value: '3.2%', delta: '-0.5% vs last month' },
]
</script>

<template>
  <Section variant="transparent" width="100%">
    <Card>
      <HStack align="stretch" :gap="4">
        <template v-for="(metric, index) in metrics" :key="metric.label">
          <Divider v-if="index > 0" orientation="vertical" style="align-self: stretch; height: auto" />
          <StackItem size="fill">
            <VStack :gap="1">
              <Text type="label">
                {{ metric.label }}
              </Text>
              <Text type="label">
                {{ metric.value }}
              </Text>
              <Text color="secondary" type="supporting">
                {{ metric.delta }}
              </Text>
            </VStack>
          </StackItem>
        </template>
      </HStack>
    </Card>
  </Section>
</template>
