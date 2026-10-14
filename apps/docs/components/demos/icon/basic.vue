<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="4" h-align="start">
    <Icon name="carbon:search" color="primary" size="md" />
    <Text>
      <Icon name="carbon:settings" /> Settings
    </Text>
    <Text size="lg">
      <Icon name="carbon:settings" /> Settings
    </Text>
  </VStack>
</template>
