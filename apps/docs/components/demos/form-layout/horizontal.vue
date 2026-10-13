<script setup lang="ts">
import { FormLayout } from '@astryx-vue/core/FormLayout'
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const first = shallowRef('Jordan')
const last = shallowRef('Rivera')
</script>

<template>
  <FormLayout direction="horizontal" style="width: 100%; max-width: 400px">
    <TextInput v-model="first" label="First Name" />
    <TextInput v-model="last" label="Last Name" />
  </FormLayout>
</template>
