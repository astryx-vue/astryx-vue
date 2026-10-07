<script setup lang="ts">
import { CheckboxIndicator } from '@astryx-vue/core/CheckboxIndicator'
</script>

<template>
  <div class="checkbox-indicator-preview">
    <div v-for="size in (['sm', 'md'] as const)" :key="size" class="checkbox-indicator-preview-row">
      <span>{{ size }}</span>
      <span v-for="state in (['unchecked', 'checked', 'indeterminate'] as const)" :key="state" class="checkbox-indicator-preview-item">
        <CheckboxIndicator :state="state" :size="size" />
        <span>{{ state }}</span>
      </span>
    </div>
    <div class="checkbox-indicator-preview-row">
      <span>Disabled</span>
      <CheckboxIndicator state="unchecked" is-disabled />
      <CheckboxIndicator state="checked" is-disabled />
      <CheckboxIndicator state="indeterminate" is-disabled />
    </div>
  </div>
</template>
