<script setup lang="ts">
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Token } from '@astryx-vue/core/Token'
</script>

<template>
  <HStack :gap="10" h-align="center" wrap="wrap">
    <HStack align="center" :gap="2">
      <Token label="Horizontal" />
      <Token label="Horizontal" />
      <Token label="Horizontal" />
    </HStack>
    <VStack :gap="2">
      <Token label="Vertical" />
      <Token label="Vertical" />
      <Token label="Vertical" />
    </VStack>
  </HStack>
</template>
