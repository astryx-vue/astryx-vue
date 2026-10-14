<script setup lang="ts">
import { TextArea } from '@astryx-vue/core/TextArea'
import { ref } from 'vue'

const value = ref('Excited to announce that our team just shipped the new dashboard! Check it out and let us know what you think.')
</script>

<template>
  <div style="width: 400px; max-width: 100%">
    <TextArea
      v-model="value"
      label="Status update"
      placeholder="What's on your mind?"
      :maxlength="280"
      :rows="3"
    />
  </div>
</template>
