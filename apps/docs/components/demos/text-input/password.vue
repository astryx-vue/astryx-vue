<script setup lang="ts">
import { IconButton } from '@astryx-vue/core/IconButton'
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const password = shallowRef('correct-horse')
const visible = shallowRef(false)
</script>

<template>
  <div class="input-preview-stack">
    <TextInput v-model="password" label="Password" :type="visible ? 'text' : 'password'" auto-complete="new-password" description="Use the end slot for an interactive accessory.">
      <template #end>
        <IconButton class="input-preview-accessory" :label="visible ? 'Hide password' : 'Show password'" variant="ghost" size="sm" :aria-pressed="visible" @click="visible = !visible">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M1 8s2.5-4 7-4 7 4 7 4-2.5 4-7 4-7-4-7-4Z" /><circle cx="8" cy="8" r="2" /><path v-if="!visible" d="m2 2 12 12" /></svg>
        </IconButton>
      </template>
    </TextInput>
  </div>
</template>
