<script setup lang="ts">
import { FormLayout } from '@astryx-vue/core/FormLayout'
import { Selector } from '@astryx-vue/core/Selector'
import { TextArea } from '@astryx-vue/core/TextArea'
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const displayName = shallowRef('Jane Doe')
const email = shallowRef('jane@example.com')
const timezone = shallowRef('America/Los_Angeles')
const bio = shallowRef('')

const timezones = [
  { label: 'Pacific Time', value: 'America/Los_Angeles' },
  { label: 'Eastern Time', value: 'America/New_York' },
  { label: 'UTC', value: 'UTC' },
]
</script>

<template>
  <FormLayout direction="horizontal-labels">
    <TextInput v-model="displayName" label="Display Name" />
    <TextInput v-model="email" label="Email" />
    <Selector v-model="timezone" label="Timezone" :options="timezones" />
    <TextArea v-model="bio" label="Bio" :rows="3" />
  </FormLayout>
</template>
