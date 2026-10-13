<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <HStack :gap="4" wrap="wrap">
    <Card :width="270" variant="muted">
      <VStack :gap="2">
        <Heading :level="3">
          Tip
        </Heading>
        <Text type="body" color="secondary">
          Use the muted variant for callouts or supplementary information.
        </Text>
      </VStack>
    </Card>
    <Card :width="270" variant="muted">
      <VStack :gap="2">
        <Heading :level="3">
          Note
        </Heading>
        <Text type="body" color="secondary">
          Muted cards work well in sidebars or help panels.
        </Text>
      </VStack>
    </Card>
  </HStack>
</template>
