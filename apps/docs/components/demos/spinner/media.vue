<script setup lang="ts">
import { Spinner } from '@astryx-vue/core/Spinner'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack align="center" :gap="4">
    <Spinner shade="default" />
    <div class="spinner-media">
      <Spinner shade="onMedia" />
    </div>
  </HStack>
</template>

<style scoped>
.spinner-media {
  padding: 16px;
  border-radius: 8px;
  background-color: #1a1a2e;
}
</style>
