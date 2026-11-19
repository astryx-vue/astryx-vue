<script setup lang="ts">
import { InfoTip } from '@astryx-vue/core/InfoTip'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="1">
    <HStack :gap="1" align="center">
      <Text type="label" color="secondary">
        Rolling average
      </Text>
      <InfoTip content="30-day rolling average, recomputed nightly." label="About this metric" />
    </HStack>
    <Text type="display-3">
      1,284
    </Text>
  </VStack>
</template>
