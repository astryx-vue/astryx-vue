<script setup lang="ts">
import type { TextInputStatus } from '@astryx-vue/core/TextInput'
import { TextInput } from '@astryx-vue/core/TextInput'
import { computed, shallowRef } from 'vue'

const email = shallowRef('ada')
const slug = shallowRef('public-project')
const name = shallowRef('Ada Lovelace')
const status = computed<TextInputStatus>(() => email.value.includes('@')
  ? { type: 'success', message: 'Email format looks correct.' }
  : { type: 'error', message: 'Enter an email address containing @.' })
</script>

<template>
  <div class="input-preview-grid">
    <TextInput v-model="email" label="Email" type="email" :status="status" />
    <TextInput v-model="slug" label="Project slug" :status="{ type: 'warning', message: 'This name is visible to everyone.' }" status-variant="detached" />
    <TextInput v-model="name" label="Display name" :status="{ type: 'success', message: 'This name is available.' }" status-variant="tooltip" />
  </div>
</template>
