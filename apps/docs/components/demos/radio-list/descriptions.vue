<script setup lang="ts">
import { RadioList, RadioListItem } from '@astryx-vue/core/RadioList'
import { shallowRef } from 'vue'

const value = shallowRef('')
</script>

<template>
  <RadioList v-model="value" label="Notification preference" description="Choose how you would like to be notified">
    <RadioListItem label="Email" value="email" description="Receive notifications via email" />
    <RadioListItem label="SMS" value="sms" description="Standard messaging rates apply" />
    <RadioListItem label="Push notification" value="push" description="Instant alerts on your device" />
  </RadioList>
</template>
