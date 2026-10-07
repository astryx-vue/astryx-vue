<script setup lang="ts">
import type { TextInputSize } from '@astryx-vue/core/TextInput'
import { TextInput } from '@astryx-vue/core/TextInput'
import { reactive } from 'vue'

const sizes: TextInputSize[] = ['sm', 'md', 'lg']
const values = reactive({ sm: 'Compact', md: 'Default', lg: 'Large' })
</script>

<template>
  <div class="input-preview-grid">
    <TextInput v-for="size in sizes" :key="size" v-model="values[size]" :label="size" :size="size" />
  </div>
</template>
