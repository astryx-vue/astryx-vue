<script setup lang="ts">
import { ChatEmojiPicker } from '@astryx-vue/lab'
import { ref } from 'vue'

const picked = ref('')

function remember(emoji: string) {
  picked.value = emoji
}
</script>

<template>
  <div class="lab-demo-row">
    <ChatEmojiPicker @select="remember">
      <button type="button">
        Add emoji
      </button>
    </ChatEmojiPicker>
    <span>{{ picked || 'Nothing picked yet' }}</span>
  </div>
</template>
