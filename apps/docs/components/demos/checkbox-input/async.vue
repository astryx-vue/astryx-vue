<script setup lang="ts">
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { shallowRef } from 'vue'

const enabled = shallowRef(false)
const failNext = shallowRef(false)
const message = shallowRef('Changes take one second to save.')
const hasError = shallowRef(false)
async function save(): Promise<void> {
  const shouldFail = failNext.value
  hasError.value = false
  message.value = 'Saving…'
  await new Promise(resolve => setTimeout(resolve, 1000))
  if (shouldFail)
    throw new Error('Save failed. Change the selection to try again.')
  message.value = 'Preferences saved.'
}
function failed(error: unknown): void {
  hasError.value = true
  message.value = error instanceof Error ? error.message : 'Save failed. Try again.'
}
</script>

<template>
  <div class="input-preview-stack">
    <CheckboxInput v-model="enabled" label="Enable notifications" :change-action="save" :status="{ type: hasError ? 'error' : 'success', message }" @action-error="failed" />
    <CheckboxInput v-model="failNext" label="Simulate a failed save" size="sm" />
    <p class="input-preview-note">
      The selection stays visible if saving fails. Turn off the simulation and change the selection to retry.
    </p>
  </div>
</template>
