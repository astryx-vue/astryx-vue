<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Popover } from '@astryx-vue/core/Popover'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <div class="input-preview-grid">
    <VStack :gap="2" align="center">
      <div class="astryx-popover" style="position: relative; top: auto; left: auto; width: 240px">
        <VStack :gap="3">
          <span>Short, interactive content.</span>
          <Button label="Got it" variant="primary" />
        </VStack>
      </div>
      <Popover label="Project details">
        <Button label="Details" variant="secondary" />
        <template #content>
          <span>Short, interactive content.</span>
        </template>
      </Popover>
    </VStack>
  </div>
</template>
