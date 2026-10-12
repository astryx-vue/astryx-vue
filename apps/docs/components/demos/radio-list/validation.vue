<script setup lang="ts">
import { RadioList, RadioListItem } from '@astryx-vue/core/RadioList'
import { computed, shallowRef } from 'vue'

const value = shallowRef('')
const status = computed(() => value.value === ''
  ? { type: 'error' as const, message: 'Please select a notification method' }
  : undefined)
</script>

<template>
  <RadioList v-model="value" label="Notification preference" is-required :status="status">
    <RadioListItem label="Email" value="email" />
    <RadioListItem label="SMS" value="sms" />
    <RadioListItem label="Push notification" value="push" />
  </RadioList>
</template>
