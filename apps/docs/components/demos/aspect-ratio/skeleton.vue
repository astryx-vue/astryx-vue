<script setup lang="ts">
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
import { Center } from '@astryx-vue/core/Center'
import { Skeleton } from '@astryx-vue/core/Skeleton'
</script>

<template>
  <Center :width="600">
    <AspectRatio :ratio="16 / 9">
      <Skeleton height="100%" width="100%" />
    </AspectRatio>
  </Center>
</template>
