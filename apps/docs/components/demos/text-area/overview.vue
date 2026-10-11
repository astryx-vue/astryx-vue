<script setup lang="ts">
import { TextArea } from '@astryx-vue/core/TextArea'
import { shallowRef } from 'vue'

const bio = shallowRef('A short introduction.')
</script>

<template>
  <TextArea v-model="bio" label="Bio" description="Shown on your profile." />
</template>
