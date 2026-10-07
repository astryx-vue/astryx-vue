<script setup lang="ts">
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const disabled = shallowRef('Unavailable')
const readOnly = shallowRef('INV-2026-0042')
const owner = shallowRef('Ada Lovelace')
</script>

<template>
  <div class="input-preview-grid">
    <TextInput v-model="disabled" label="Disabled" is-disabled has-clear />
    <TextInput v-model="readOnly" label="Read-only" is-read-only html-name="invoice" description="This value is still included in form submission." />
    <TextInput v-model="owner" label="Owner" is-disabled disabled-message="You need the Editor role to change the owner." label-tooltip="The person responsible for this project." />
  </div>
</template>
