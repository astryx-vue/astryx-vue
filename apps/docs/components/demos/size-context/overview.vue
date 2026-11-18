<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { SizeProvider } from '@astryx-vue/core/SizeContext'
import { TextInput } from '@astryx-vue/core/TextInput'
</script>

<template>
  <div class="size-context-preview">
    <div class="size-context-preview__row">
      <Button>Default</Button>
      <TextInput placeholder="Default" />
    </div>
    <SizeProvider value="sm">
      <div class="size-context-preview__row">
        <Button>Small</Button>
        <TextInput placeholder="Small" />
      </div>
    </SizeProvider>
  </div>
</template>
