<script setup lang="ts">
import { CheckIndicator } from '@astryx-vue/core/Indicator'
</script>

<template>
  <div class="indicator-board">
    <div v-for="size in (['sm', 'md'] as const)" :key="size" class="indicator-board-row">
      <span class="checkbox-indicator-preview-size">{{ size }}</span>
      <span class="indicator-board-item">
        <CheckIndicator state="unchecked" :size="size" />
        <span>Unchecked</span>
      </span>
      <span class="indicator-board-item">
        <CheckIndicator state="checked" :size="size" />
        <span>Checked</span>
      </span>
      <span class="indicator-board-item">
        <CheckIndicator state="checked" :size="size" is-disabled />
        <span>Disabled</span>
      </span>
    </div>
  </div>
</template>
