<script setup lang="ts">
import { RadioList, RadioListItem } from '@astryx-vue/core/RadioList'
import { shallowRef } from 'vue'

const value = shallowRef('md')
</script>

<template>
  <RadioList v-model="value" label="Size" orientation="horizontal">
    <RadioListItem label="Small" value="sm" />
    <RadioListItem label="Medium" value="md" />
    <RadioListItem label="Large" value="lg" />
  </RadioList>
</template>
