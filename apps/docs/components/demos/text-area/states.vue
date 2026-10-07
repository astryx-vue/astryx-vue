<script setup lang="ts">
import { TextArea } from '@astryx-vue/core/TextArea'
import { shallowRef } from 'vue'

const disabled = shallowRef('Unavailable')
const readOnly = shallowRef('This value is read-only.')
const locked = shallowRef('Only editors can edit this.')
</script>

<template>
  <div class="input-preview-grid">
    <TextArea v-model="disabled" label="Disabled" is-disabled has-clear />
    <TextArea v-model="readOnly" label="Read-only" is-read-only html-name="notes" description="This value is still included in form submission." />
    <TextArea v-model="locked" label="Locked" is-disabled disabled-message="You need the Editor role to edit this field." />
  </div>
</template>
