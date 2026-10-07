<script setup lang="ts">
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const name = shallowRef('Ada Lovelace')
const email = shallowRef('ada@example.com')
</script>

<template>
  <div class="input-preview-grid">
    <TextInput v-model="name" label="Name" description="How we should address you." is-required required-label="Required" auto-complete="name" />
    <TextInput v-model="email" label="Email" type="email" description="Your work email address." auto-complete="email" html-name="email" />
  </div>
</template>
