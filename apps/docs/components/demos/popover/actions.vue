<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Popover } from '@astryx-vue/core/Popover'
</script>

<template>
  <div class="input-preview-grid">
    <Popover role="none" :has-close-button="false" :padding="1" placement="below" alignment="end">
      <Button label="More actions" variant="ghost" />
      <template #content>
        <Button label="Duplicate" variant="ghost" />
        <Button label="Rename" variant="ghost" />
        <Button label="Delete" variant="destructive" />
      </template>
    </Popover>
  </div>
</template>
