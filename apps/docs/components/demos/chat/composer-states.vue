<script setup lang="ts">
import { ChatComposer } from '@astryx-vue/core/Chat'
import { ref } from 'vue'

const streaming = ref(true)
</script>

<template>
  <div class="chat-preview-composer">
    <ChatComposer is-disabled is-stop-shown model-value="Still writing the answer." @stop="streaming = false" />
    <ChatComposer
      density="compact"
      elevation="none"
      placeholder="Flat and compact"
      :status="{ type: 'warning', message: 'The connection is slow.' }"
    />
    <ChatComposer
      :status="{ type: 'error', message: streaming ? 'Could not send the last message.' : 'Cleared.' }"
      status-position="top"
    />
  </div>
</template>
