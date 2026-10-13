<script setup lang="ts">
import { FormLayout } from '@astryx-vue/core/FormLayout'
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const first = shallowRef('Jordan')
const last = shallowRef('Rivera')
</script>

<template>
  <FormLayout direction="horizontal">
    <TextInput v-model="first" label="First" />
    <TextInput v-model="last" label="Last" />
  </FormLayout>
</template>
