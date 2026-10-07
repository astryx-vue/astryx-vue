<script setup lang="ts">
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { shallowRef } from 'vue'

const checked = shallowRef(true)
const unchecked = shallowRef(false)
</script>

<template>
  <div class="input-preview-stack">
    <CheckboxInput v-model="checked" label="Read-only selection" is-read-only />
    <CheckboxInput v-model="unchecked" label="Disabled option" is-disabled />
    <CheckboxInput v-model="checked" label="Managed by your team" is-disabled disabled-message="Contact your administrator to change this setting." />
    <CheckboxInput v-model="checked" label="Saving preferences" is-loading />
    <CheckboxInput v-model="unchecked" label="Email receipts" label-tooltip="We send a receipt after each payment." is-optional />
  </div>
</template>
