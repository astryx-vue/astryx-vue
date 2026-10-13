<script setup lang="ts">
import type { HeadingLevel } from '@astryx-vue/core/Heading'
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'

const levels: HeadingLevel[] = [1, 2, 3, 4, 5, 6]
</script>

<template>
  <VStack :gap="3">
    <Heading v-for="level in levels" :key="level" :level="level">
      Heading {{ level }}
    </Heading>
  </VStack>
</template>
