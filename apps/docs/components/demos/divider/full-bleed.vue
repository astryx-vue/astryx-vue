<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Divider } from '@astryx-vue/core/Divider'
import { Section } from '@astryx-vue/core/Section'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Section variant="transparent" width="100%">
    <Card :width="400">
      <VStack :gap="3">
        <Text type="label">
          Order Summary
        </Text>
        <HStack h-align="between">
          <Text type="body">
            3 items
          </Text>
          <Text type="body">
            $127.00
          </Text>
        </HStack>
        <Divider is-full-bleed />
        <HStack h-align="between">
          <Text type="body">
            Shipping
          </Text>
          <Text type="body">
            $7.99
          </Text>
        </HStack>
        <HStack h-align="between">
          <Text type="body">
            Tax
          </Text>
          <Text type="body">
            $10.16
          </Text>
        </HStack>
        <Divider is-full-bleed />
        <HStack h-align="between">
          <Text type="label">
            Total
          </Text>
          <Text type="label">
            $145.15
          </Text>
        </HStack>
      </VStack>
    </Card>
  </Section>
</template>
