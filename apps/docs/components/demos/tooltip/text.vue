<script setup lang="ts">
import { Tooltip } from '@astryx-vue/core/Tooltip'
</script>

<template>
  <div class="input-preview-grid">
    <p>
      Your balance is
      <Tooltip content="Available funds, updated every minute">
        available
      </Tooltip>
      for withdrawal.
    </p>
  </div>
</template>
