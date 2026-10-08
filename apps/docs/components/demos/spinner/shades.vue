<script setup lang="ts">
import { Spinner } from '@astryx-vue/core/Spinner'

const cellStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '88px',
  borderRadius: '8px',
}
</script>

<template>
  <div class="input-preview-grid">
    <div :style="cellStyle">
      <Spinner shade="default" label="default" />
    </div>
    <div :style="cellStyle">
      <Spinner shade="subtle" label="subtle" />
    </div>
    <div :style="{ ...cellStyle, background: '#171717' }">
      <Spinner shade="onMedia" label="onMedia">
        <template #label>
          <span style="color: #fff;">onMedia</span>
        </template>
      </Spinner>
    </div>
    <div :style="{ ...cellStyle, color: 'var(--astryx-color-text-primary)' }">
      <Spinner shade="inherit" label="inherit" />
    </div>
  </div>
</template>
