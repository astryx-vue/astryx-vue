<script setup lang="ts">
import { CheckboxIndicator } from '@astryx-vue/core/CheckboxIndicator'
</script>

<template>
  <div class="checkbox-indicator-overview">
    <span class="checkbox-indicator-overview-item">
      <CheckboxIndicator state="unchecked" />
      <span>Unchecked</span>
    </span>
    <span class="checkbox-indicator-overview-item">
      <CheckboxIndicator state="checked" />
      <span>Checked</span>
    </span>
    <span class="checkbox-indicator-overview-item">
      <CheckboxIndicator state="indeterminate" />
      <span>Indeterminate</span>
    </span>
    <span class="checkbox-indicator-overview-item">
      <CheckboxIndicator state="unchecked" is-disabled />
      <span>Disabled</span>
    </span>
    <span class="checkbox-indicator-overview-item">
      <CheckboxIndicator state="checked" is-disabled />
      <span>Disabled checked</span>
    </span>
    <span class="checkbox-indicator-overview-item">
      <CheckboxIndicator state="indeterminate" is-disabled />
      <span>Disabled indeterminate</span>
    </span>
  </div>
</template>
