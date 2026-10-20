<script setup lang="ts">
import { RadioList, RadioListItem } from '@astryx-vue/core/RadioList'
import { shallowRef } from 'vue'

const value = shallowRef('standard')
</script>

<template>
  <RadioList v-model="value" label="Shipping method">
    <RadioListItem label="Standard" value="standard" description="5–7 business days" />
    <RadioListItem label="Express" value="express" description="2–3 business days" />
    <RadioListItem label="Overnight" value="overnight" description="Next business day" />
    <RadioListItem label="Same day" value="sameday" description="Not available in your area" is-disabled />
  </RadioList>
</template>
