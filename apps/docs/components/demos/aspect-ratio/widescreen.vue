<script setup lang="ts">
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
import { Center } from '@astryx-vue/core/Center'
</script>

<template>
  <Center :width="600">
    <AspectRatio :ratio="16 / 9" fit="cover">
      <img alt="16:9 widescreen" src="/layout/wide.svg">
    </AspectRatio>
  </Center>
</template>
