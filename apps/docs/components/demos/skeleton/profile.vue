<script setup lang="ts">
import { Skeleton } from '@astryx-vue/core/Skeleton'
import { HStack, VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <VStack
    aria-busy="true"
    aria-label="Loading profile"
    :gap="4"
    role="status"
    :width="300"
  >
    <HStack align="center" :gap="4">
      <Skeleton :height="64" :index="0" radius="rounded" :width="64" />
      <VStack :gap="2">
        <Skeleton :height="20" :index="1" :width="160" />
        <Skeleton :height="16" :index="2" :width="80" />
      </VStack>
    </HStack>

    <VStack :gap="2">
      <Skeleton :height="16" :index="3" width="90%" />
      <Skeleton :height="16" :index="4" width="100%" />
      <Skeleton :height="16" :index="5" width="75%" />
    </VStack>
  </VStack>
</template>
