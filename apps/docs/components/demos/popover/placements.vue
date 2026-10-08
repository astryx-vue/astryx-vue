<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Popover } from '@astryx-vue/core/Popover'
</script>

<template>
  <div class="input-preview-grid">
    <Popover label="Below" placement="below">
      <Button label="Below" variant="secondary" />
      <template #content>
        <p>Opens below the trigger.</p>
      </template>
    </Popover>
    <Popover label="Above" placement="above" alignment="end">
      <Button label="Above" variant="secondary" />
      <template #content>
        <p>Opens above the trigger, aligned to its end.</p>
      </template>
    </Popover>
  </div>
</template>
