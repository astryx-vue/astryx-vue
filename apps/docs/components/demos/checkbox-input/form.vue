<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { shallowRef } from 'vue'

const accepted = shallowRef(false)
const result = shallowRef('')
function submit(event: Event): void {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = `Submitted: terms=${data.get('terms')}`
}
function reset(): void {
  accepted.value = false
  result.value = ''
}
</script>

<template>
  <form class="input-preview-stack" @submit.prevent="submit" @reset="reset">
    <CheckboxInput v-model="accepted" label="I accept the terms" html-name="terms" value="accepted" is-required :status="accepted ? { type: 'success', message: 'Ready to submit.' } : { type: 'error', message: 'Accept the terms before you submit.' }" />
    <div class="checkbox-preview-actions">
      <Button type="submit" label="Submit" />
      <Button type="reset" variant="secondary" label="Reset" />
    </div>
    <p class="input-preview-note" role="status">
      {{ result || 'This example uses native form validation.' }}
    </p>
  </form>
</template>
