<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { SizeProvider } from '@astryx-vue/core/SizeContext'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const defaultValue = ref('')
const smallValue = ref('')
</script>

<template>
  <div class="size-context-preview">
    <div class="size-context-preview__row">
      <Button label="Default" />
      <TextInput v-model="defaultValue" label="Default" is-label-hidden placeholder="Default" />
    </div>
    <SizeProvider value="sm">
      <div class="size-context-preview__row">
        <Button label="Small" />
        <TextInput v-model="smallValue" label="Small" is-label-hidden placeholder="Small" />
      </div>
    </SizeProvider>
  </div>
</template>
