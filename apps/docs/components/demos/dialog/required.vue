<script setup lang="ts">
import { Dialog, useImperativeDialog } from '@astryx-vue/core/Dialog'
import { h } from 'vue'
import RequiredBody from './required-body.vue'

const dialog = useImperativeDialog({ purpose: 'required' })

function openDialog() {
  dialog.show(() => h(RequiredBody, { requestClose: () => dialog.hide() }))
}
</script>

<template>
  <Dialog is-open is-inline purpose="required">
    <RequiredBody :request-close="openDialog" />
  </Dialog>
  <component :is="dialog.Host" />
</template>
