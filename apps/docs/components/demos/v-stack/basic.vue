<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="3">
    <Heading :level="5">
      Weekly Report
    </Heading>
    <Text type="body" color="secondary">
      VStack arranges its children in a vertical column.
    </Text>
    <Text type="body" color="secondary">
      The gap prop controls the spacing between each item.
    </Text>
  </VStack>
</template>
