<script setup lang="ts">
import { RadioIndicator } from '@astryx-vue/core/Indicator'
</script>

<template>
  <div class="indicator-board">
    <div class="indicator-board-row">
      <span class="indicator-board-item">
        <RadioIndicator state="unchecked" />
        <span>Unchecked</span>
      </span>
      <span class="indicator-board-item">
        <RadioIndicator state="checked" />
        <span>Checked</span>
      </span>
      <span class="indicator-board-item">
        <RadioIndicator state="checked" is-disabled />
        <span>Disabled</span>
      </span>
    </div>
  </div>
</template>
