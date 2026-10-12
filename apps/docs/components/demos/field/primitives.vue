<script setup lang="ts">
import { FieldLabel } from '@astryx-vue/core/Field'
import { FieldStatus } from '@astryx-vue/core/FieldStatus'
import { shallowRef, useId } from 'vue'

const name = shallowRef('Ada')
const inputId = `custom-name-${useId()}`
</script>

<template>
  <div class="input-preview-stack">
    <FieldLabel :input-id="inputId" label="Custom control" description="Compose the label and status independently." :description-id="`${inputId}-help`" label-tooltip="Use these parts when the control needs its own layout." />
    <input :id="inputId" v-model="name" class="input-preview-native" :aria-describedby="`${inputId}-help ${inputId}-status`">
    <FieldStatus :id="`${inputId}-status`" type="warning" message="This custom control uses a detached status message." variant="detached" />
  </div>
</template>
