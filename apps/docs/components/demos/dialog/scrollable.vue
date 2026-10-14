<script setup lang="ts">
import { Dialog, useImperativeDialog } from '@astryx-vue/core/Dialog'
import { h } from 'vue'
import ScrollBody from './scroll-body.vue'

const dialog = useImperativeDialog({ maxHeight: '50dvh' })

function openDialog() {
  dialog.show(() => h(ScrollBody, { requestClose: () => dialog.hide() }))
}
</script>

<template>
  <Dialog is-open is-inline :max-height="360">
    <ScrollBody :request-close="openDialog" />
  </Dialog>
  <component :is="dialog.Host" />
</template>
