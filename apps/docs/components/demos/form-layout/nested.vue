<script setup lang="ts">
import { FormLayout } from '@astryx-vue/core/FormLayout'
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const first = shallowRef('Priya')
const last = shallowRef('Sharma')
const email = shallowRef('priya.sharma@example.com')
const city = shallowRef('San Francisco')
const state = shallowRef('CA')
const zip = shallowRef('94105')
</script>

<template>
  <FormLayout>
    <FormLayout direction="horizontal">
      <TextInput v-model="first" label="First Name" />
      <TextInput v-model="last" label="Last Name" />
    </FormLayout>
    <TextInput v-model="email" label="Email" />
    <FormLayout direction="horizontal">
      <TextInput v-model="city" label="City" />
      <TextInput v-model="state" label="State" />
      <TextInput v-model="zip" label="ZIP" />
    </FormLayout>
  </FormLayout>
</template>
