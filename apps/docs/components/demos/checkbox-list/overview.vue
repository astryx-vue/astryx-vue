<script setup lang="ts">
import { CheckboxList, CheckboxListItem } from '@astryx-vue/core/CheckboxList'
import { shallowRef } from 'vue'

const value = shallowRef(['email'])
</script>

<template>
  <CheckboxList v-model="value" label="Notification preferences" description="Choose how you would like to be notified" has-dividers>
    <CheckboxListItem label="Email" value="email" description="Weekly digest every Monday" />
    <CheckboxListItem label="Push notification" value="push" description="Instant alerts on your device" />
    <CheckboxListItem label="SMS" value="sms" description="Standard messaging rates apply" />
  </CheckboxList>
</template>
