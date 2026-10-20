<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="6">
    <VStack :gap="2">
      <Text type="supporting" color="secondary">
        HAlign: start
      </Text>
      <HStack :gap="2">
        <Badge label="React" />
        <Badge label="TypeScript" />
        <Badge label="Node.js" />
      </HStack>
    </VStack>
    <VStack :gap="2">
      <Text type="supporting" color="secondary">
        HAlign: center
      </Text>
      <HStack :gap="4" h-align="center">
        <Badge label="Design" />
        <Badge label="Engineering" />
        <Badge label="Product" />
      </HStack>
    </VStack>
    <VStack :gap="2">
      <Text type="supporting" color="secondary">
        HAlign: between
      </Text>
      <HStack :gap="2" h-align="between">
        <Badge label="Start" />
        <Badge label="Middle" />
        <Badge label="End" />
      </HStack>
    </VStack>
  </VStack>
</template>
