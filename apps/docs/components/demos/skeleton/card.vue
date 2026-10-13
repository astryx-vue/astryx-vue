<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Skeleton } from '@astryx-vue/core/Skeleton'
import { HStack, VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Card :width="320">
    <VStack :gap="3">
      <HStack align="center" :gap="3">
        <Skeleton :height="40" :index="0" radius="rounded" :width="40" />
        <VStack :gap="1">
          <Skeleton :height="14" :index="1" :width="120" />
          <Skeleton :height="12" :index="2" :width="80" />
        </VStack>
      </HStack>
      <Skeleton :height="14" :index="3" width="100%" />
      <Skeleton :height="14" :index="4" width="90%" />
      <Skeleton :height="14" :index="5" width="75%" />
    </VStack>
  </Card>
</template>
