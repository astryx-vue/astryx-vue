<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Popover } from '@astryx-vue/core/Popover'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <div class="input-preview-grid">
    <Popover label="Project details">
      <Button label="Details" variant="secondary" />
      <template #content>
        <VStack :gap="3">
          <p>Popovers hold short, interactive content next to the control that opened them.</p>
          <Button label="Got it" variant="primary" />
        </VStack>
      </template>
    </Popover>
  </div>
</template>
