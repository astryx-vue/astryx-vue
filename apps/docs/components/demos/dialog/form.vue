<script setup lang="ts">
import { Dialog, useImperativeDialog } from '@astryx-vue/core/Dialog'
import { h } from 'vue'
import FormBody from './form-body.vue'

const dialog = useImperativeDialog({ purpose: 'form', width: 480 })

function openDialog() {
  dialog.show(() => h(FormBody, { requestClose: () => dialog.hide() }))
}
</script>

<template>
  <Dialog is-open is-inline purpose="form" :width="480">
    <FormBody :request-close="openDialog" />
  </Dialog>
  <component :is="dialog.Host" />
</template>
