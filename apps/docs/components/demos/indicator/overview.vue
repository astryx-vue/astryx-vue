<script setup lang="ts">
import { CheckboxIndicator } from '@astryx-vue/core/CheckboxIndicator'
import { CheckIndicator, RadioIndicator } from '@astryx-vue/core/Indicator'
</script>

<template>
  <div class="indicator-board">
    <div class="indicator-board-row">
      <span class="indicator-board-item">
        <CheckboxIndicator state="unchecked" />
        <span>Unchecked</span>
      </span>
      <span class="indicator-board-item">
        <CheckboxIndicator state="checked" />
        <span>Checked</span>
      </span>
      <span class="indicator-board-item">
        <CheckboxIndicator state="indeterminate" />
        <span>Mixed</span>
      </span>
      <span class="indicator-board-item">
        <CheckIndicator state="checked" />
        <span>Check</span>
      </span>
      <span class="indicator-board-item">
        <RadioIndicator state="unchecked" />
        <span>Radio</span>
      </span>
      <span class="indicator-board-item">
        <RadioIndicator state="checked" />
        <span>Selected</span>
      </span>
    </div>
  </div>
</template>
