<script setup lang="ts">
import { Spinner } from '@astryx-vue/core/Spinner'
</script>

<template>
  <div class="input-preview-grid">
    <Spinner shade="default" label="default" />
    <Spinner shade="subtle" label="subtle" />
    <div style="padding: 12px; border-radius: 8px; background: #171717;">
      <Spinner shade="onMedia" label="onMedia">
        <template #label>
          <span style="color: #fff;">onMedia</span>
        </template>
      </Spinner>
    </div>
    <span style="color: var(--astryx-color-text-primary);">
      <Spinner shade="inherit" label="inherit" />
    </span>
  </div>
</template>
