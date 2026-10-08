<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Tooltip } from '@astryx-vue/core/Tooltip'
</script>

<template>
  <div class="input-preview-grid">
    <Tooltip content="Above" placement="above">
      <Button label="Above" />
    </Tooltip>
    <Tooltip content="Below" placement="below">
      <Button label="Below" />
    </Tooltip>
    <Tooltip content="Start" placement="start">
      <Button label="Start" />
    </Tooltip>
    <Tooltip content="End" placement="end">
      <Button label="End" />
    </Tooltip>
  </div>
</template>
