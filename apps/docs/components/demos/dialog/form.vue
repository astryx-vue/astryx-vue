<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { VStack } from '@astryx-vue/core/Stack'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const isOpen = ref(false)
const name = ref('')
</script>

<template>
  <div class="input-preview-grid">
    <Button label="New folder" variant="secondary" @click="isOpen = true" />
    <Dialog :is-open="isOpen" purpose="form" @open-change="isOpen = $event">
      <VStack :gap="3">
        <DialogHeader title="New folder" has-close-button @open-change="isOpen = $event" />
        <TextInput v-model="name" label="Folder name" placeholder="Untitled folder" />
        <Button label="Create" variant="primary" @click="isOpen = false" />
      </VStack>
    </Dialog>
  </div>
</template>
