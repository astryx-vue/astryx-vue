<script setup lang="ts">
import { AlertDialog, useImperativeAlertDialog } from '@astryx-vue/core/AlertDialog'

const alert = useImperativeAlertDialog()
const alertProps = {
  title: 'Delete item?',
  description: 'This action cannot be undone. The item and all its data will be permanently removed.',
  actionLabel: 'Delete',
} as const
</script>

<template>
  <AlertDialog
    is-open
    is-inline
    v-bind="alertProps"
    @action="alert.show({ ...alertProps, onAction: () => alert.hide() })"
  />
  <component :is="alert.Host" />
</template>
