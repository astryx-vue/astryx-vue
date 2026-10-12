<script setup lang="ts">
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
import { Center } from '@astryx-vue/core/Center'
</script>

<template>
  <Center :width="300">
    <AspectRatio :ratio="1" fit="cover" shape="ellipse">
      <img alt="Circular image" src="/layout/square.svg">
    </AspectRatio>
  </Center>
</template>
