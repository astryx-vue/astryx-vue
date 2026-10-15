<script setup lang="ts">
import { CheckIndicator } from '@astryx-vue/core/Indicator'
</script>

<template>
  <div class="indicator-board">
    <div class="indicator-board-row">
      <span class="indicator-board-item">
        <CheckIndicator state="unchecked" />
        <span>Unchecked</span>
      </span>
      <span class="indicator-board-item">
        <CheckIndicator state="checked" />
        <span>Checked</span>
      </span>
      <span class="indicator-board-item">
        <CheckIndicator state="checked" is-disabled />
        <span>Disabled</span>
      </span>
    </div>
  </div>
</template>
