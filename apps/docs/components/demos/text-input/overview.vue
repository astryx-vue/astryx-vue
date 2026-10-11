<script setup lang="ts">
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const name = shallowRef('Ada Lovelace')
</script>

<template>
  <TextInput v-model="name" label="Name" description="How we should address you." />
</template>
