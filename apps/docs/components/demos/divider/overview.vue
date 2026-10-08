<script setup lang="ts">
import { Divider } from '@astryx-vue/core/Divider'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <div class="input-preview-grid">
    <VStack :gap="3" style="width: 240px;">
      <span>Account settings</span>
      <Divider />
      <span>Notifications</span>
    </VStack>
  </div>
</template>
