<script setup lang="ts">
import { Banner } from '@astryx-vue/core/Banner'
import { Button } from '@astryx-vue/core/Button'
import { shallowRef } from 'vue'

const version = shallowRef(0)
const visible = shallowRef(true)
const saved = shallowRef(false)
function restore(): void {
  version.value += 1
  visible.value = true
  saved.value = false
}
</script>

<template>
  <div class="input-preview-stack">
    <Button label="Show notification" variant="secondary" @click="restore" />
    <Banner :key="version" :status="saved ? 'success' : 'error'" :title="saved ? 'Changes saved' : 'Save failed'" :description="saved ? 'Your settings are up to date.' : 'Try saving your settings again.'" is-dismissable @dismiss="visible = false">
      <template v-if="!saved" #end>
        <Button label="Retry" variant="ghost" size="sm" @click="saved = true" />
      </template>
    </Banner>
    <p v-if="!visible" class="input-preview-note" role="status">
      Notification dismissed. Use the button to show it again.
    </p>
  </div>
</template>
