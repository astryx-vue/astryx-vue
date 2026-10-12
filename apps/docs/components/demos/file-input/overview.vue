<script setup lang="ts">
import { FileInput } from '@astryx-vue/core/FileInput'
import { shallowRef } from 'vue'

const value = shallowRef<File | File[] | null>(null)
</script>

<template>
  <FileInput v-model="value" label="Upload file" placeholder="Drag files here or click to browse" />
</template>
