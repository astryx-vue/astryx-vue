<script setup lang="ts">
import { Spinner } from '@astryx-vue/core/Spinner'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack v-align="center" :gap="4">
    <Spinner size="sm" />
    <Spinner size="md" />
    <Spinner size="lg" />
    <Spinner size="xl" />
  </HStack>
</template>
