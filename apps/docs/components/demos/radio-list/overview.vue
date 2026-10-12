<script setup lang="ts">
import { RadioList, RadioListItem } from '@astryx-vue/core/RadioList'
import { shallowRef } from 'vue'

const value = shallowRef('')
</script>

<template>
  <RadioList v-model="value" label="Notification preference">
    <RadioListItem label="Email" value="email" />
    <RadioListItem label="SMS" value="sms" />
    <RadioListItem label="Push notification" value="push" />
  </RadioList>
</template>
