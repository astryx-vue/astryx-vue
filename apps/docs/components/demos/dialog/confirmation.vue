<script setup lang="ts">
import { Dialog, useImperativeDialog } from '@astryx-vue/core/Dialog'
import { h } from 'vue'
import ConfirmBody from './confirm-body.vue'

const dialog = useImperativeDialog({ width: 400, purpose: 'form' })

function openDialog() {
  dialog.show(() => h(ConfirmBody, { requestClose: () => dialog.hide() }))
}
</script>

<template>
  <Dialog is-open is-inline :width="400" purpose="form">
    <ConfirmBody :request-close="openDialog" />
  </Dialog>
  <component :is="dialog.Host" />
</template>
