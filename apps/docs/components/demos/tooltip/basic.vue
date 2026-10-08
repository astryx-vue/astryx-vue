<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Tooltip } from '@astryx-vue/core/Tooltip'
</script>

<template>
  <div class="input-preview-grid">
    <Tooltip content="Save your changes">
      <Button label="Save" />
    </Tooltip>
  </div>
</template>
