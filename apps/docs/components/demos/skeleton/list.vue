<script setup lang="ts">
import { Skeleton } from '@astryx-vue/core/Skeleton'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <VStack :gap="2">
    <Skeleton :height="16" :index="0" :width="300" />
    <Skeleton :height="16" :index="1" :width="280" />
    <Skeleton :height="16" :index="2" :width="320" />
    <Skeleton :height="16" :index="3" :width="260" />
    <Skeleton :height="16" :index="4" :width="290" />
  </VStack>
</template>
