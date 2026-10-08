<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { DialogHeader, useImperativeDialog } from '@astryx-vue/core/Dialog'
import { h } from 'vue'

const dialog = useImperativeDialog()
const DialogHost = dialog.Host

function showNotice(): void {
  dialog.show(() => [
    h(DialogHeader, {
      title: 'Export complete',
      subtitle: 'Your file is ready.',
      hasCloseButton: true,
      onOpenChange: () => dialog.hide(),
    }),
    h('p', 'The export finished without errors.'),
  ])
}
</script>

<template>
  <div class="input-preview-grid">
    <Button label="Export" variant="secondary" @click="showNotice" />
    <DialogHost />
  </div>
</template>
