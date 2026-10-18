<script setup lang="ts">
import { ChatComposer } from '@astryx-vue/core/Chat'
import { ref } from 'vue'

const value = ref('Hello, how can you help?')
</script>

<template>
  <ChatComposer v-model="value" />
</template>
