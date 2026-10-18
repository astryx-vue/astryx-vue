<script setup lang="ts">
import { ChatComposer, ChatComposerDrawer } from '@astryx-vue/core/Chat'
import { Token } from '@astryx-vue/core/Token'
import { ref } from 'vue'

const files = ref([
  'design-spec.pdf',
  'api-schema.json',
  'screenshot.png',
  'meeting-notes.md',
])

function remove(name: string): void {
  files.value = files.value.filter(item => item !== name)
}
</script>

<template>
  <ChatComposer>
    <template #drawer>
      <ChatComposerDrawer :count="files.length" label="Attachments">
        <Token
          v-for="name in files"
          :key="name"
          removable
          :label="name"
          @remove="remove(name)"
        />
      </ChatComposerDrawer>
    </template>
  </ChatComposer>
</template>
