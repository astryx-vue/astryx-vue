<script setup lang="ts">
import type { TransferListOption } from '@astryx-vue/lab'
import { TransferList } from '@astryx-vue/lab'
import { ref } from 'vue'

const selected = ref(['name', 'status'])
const options: readonly TransferListOption[] = [
  { value: 'name', label: 'Name', group: 'Identity' },
  { value: 'owner', label: 'Owner', group: 'Identity' },
  { value: 'status', label: 'Status', group: 'Details' },
  { value: 'updated', label: 'Last updated', group: 'Details' },
  { value: 'priority', label: 'Priority', group: 'Details' },
]
</script>

<template>
  <TransferList
    v-model="selected"
    :options="options"
    label="Visible columns"
    selected-label="Selected"
    available-label="Available"
    has-search
    has-select-all
    has-clear
    style="width: 100%"
  />
</template>
