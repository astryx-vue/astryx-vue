<script setup lang="ts">
import type { TextInputChangeEvent, TextInputStatus } from '@astryx-vue/core/TextInput'
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const name = shallowRef('Ada Lovelace')
const saved = shallowRef(name.value)
const status = shallowRef<TextInputStatus>()
let request = 0

async function save(value: string): Promise<void> {
  const current = ++request
  status.value = undefined
  await new Promise(resolve => setTimeout(resolve, 700))
  if (value.toLowerCase() === 'fail')
    throw new Error('The server could not save this name. Try another value.')
  if (current === request) {
    saved.value = value
    status.value = { type: 'success', message: 'Saved.' }
  }
}

function showError(error: unknown, value: string, _event: TextInputChangeEvent): void {
  if (name.value === value)
    status.value = { type: 'error', message: error instanceof Error ? error.message : 'Save failed.' }
}
</script>

<template>
  <div class="input-preview-stack">
    <TextInput v-model="name" label="Display name" :change-action="save" :status="status" has-clear description="Changes save automatically. Enter “fail” to try an error, then edit again to retry." @action-error="showError" />
    <p class="input-preview-note" aria-live="polite">
      Saved value: {{ saved || '(empty)' }}
    </p>
  </div>
</template>
