<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Tooltip } from '@astryx-vue/core/Tooltip'
import { ref } from 'vue'

const isOpen = ref(true)
</script>

<template>
  <div class="input-preview-row">
    <Tooltip content="Controlled tooltip" :is-open="isOpen" @open-change="isOpen = $event">
      <Button label="Hover me" />
    </Tooltip>
    <Button :label="isOpen ? 'Hide tooltip' : 'Show tooltip'" variant="ghost" @click="isOpen = !isOpen" />
  </div>
</template>
