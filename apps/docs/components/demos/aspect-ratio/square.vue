<script setup lang="ts">
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
import { Center } from '@astryx-vue/core/Center'
</script>

<template>
  <Center :width="300">
    <AspectRatio :ratio="1" fit="cover">
      <img alt="1:1 square" src="/template-assets/light-home-square-1.png">
    </AspectRatio>
  </Center>
</template>
