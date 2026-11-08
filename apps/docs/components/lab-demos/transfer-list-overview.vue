<script setup lang="ts">
import type { TransferListOption } from '@astryx-vue/lab'
import { TransferList } from '@astryx-vue/lab'
import { ref } from 'vue'

const selected = ref(['name'])
const options: readonly TransferListOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'owner', label: 'Owner' },
  { value: 'status', label: 'Status' },
]
</script>

<template>
  <TransferList
    v-model="selected"
    :options="options"
    label="Visible columns"
    is-label-hidden
    selected-label="Selected"
    available-label="Available"
    style="width: 100%"
  />
</template>
