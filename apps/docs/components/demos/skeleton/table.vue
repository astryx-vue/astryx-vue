<script setup lang="ts">
import { Skeleton } from '@astryx-vue/core/Skeleton'
import { HStack, VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <VStack :gap="2">
    <HStack v-for="row in 4" :key="row" align="center" :gap="4">
      <Skeleton :height="16" :index="(row - 1) * 4" :width="50" />
      <Skeleton :height="16" :index="(row - 1) * 4 + 1" :width="180" />
      <Skeleton :height="16" :index="(row - 1) * 4 + 2" :width="100" />
      <Skeleton :height="16" :index="(row - 1) * 4 + 3" :width="80" />
    </HStack>
  </VStack>
</template>
