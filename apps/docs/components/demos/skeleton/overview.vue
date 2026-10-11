<script setup lang="ts">
import { Skeleton } from '@astryx-vue/core/Skeleton'
import { HStack, VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <VStack aria-busy="true" aria-label="Loading profile" :gap="3" role="status" width="100%">
    <HStack align="center" :gap="3">
      <Skeleton :height="48" :index="0" radius="rounded" :width="48" />
      <VStack :gap="2">
        <Skeleton :height="14" :index="1" width="70%" />
        <Skeleton :height="12" :index="2" width="40%" />
      </VStack>
    </HStack>
    <Skeleton :height="12" :index="3" width="100%" />
    <Skeleton :height="12" :index="4" width="80%" />
  </VStack>
</template>
