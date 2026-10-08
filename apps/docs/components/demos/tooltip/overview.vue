<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { VStack } from '@astryx-vue/core/Stack'
import { Tooltip } from '@astryx-vue/core/Tooltip'
</script>

<template>
  <div class="input-preview-grid">
    <VStack :gap="2" align="center">
      <span class="astryx-tooltip" style="position: relative">Save your changes</span>
      <Tooltip content="Save your changes">
        <Button label="Save" />
      </Tooltip>
    </VStack>
  </div>
</template>
