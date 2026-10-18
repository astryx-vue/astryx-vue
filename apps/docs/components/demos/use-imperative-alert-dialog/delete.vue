<script setup lang="ts">
import { useImperativeAlertDialog } from '@astryx-vue/core/AlertDialog'
import { Button } from '@astryx-vue/core/Button'

const alert = useImperativeAlertDialog()
const AlertHost = alert.Host

function confirmDelete(): void {
  alert.show({
    title: 'Delete item?',
    description: 'This action cannot be undone. The item and all its data will be permanently removed.',
    actionLabel: 'Delete',
    onAction: () => alert.hide(),
  })
}
</script>

<template>
  <div class="alert-dialog-preview">
    <Button label="Delete item" variant="destructive" @click="confirmDelete" />
    <AlertHost />
  </div>
</template>
