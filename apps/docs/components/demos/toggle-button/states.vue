<script setup lang="ts">
import { ToggleButton } from '@astryx-vue/core/ToggleButton'
import { shallowRef } from 'vue'

const isShared = shallowRef(false)
const note = shallowRef('')

async function shareWithTeam(next: boolean): Promise<void> {
  note.value = ''
  await new Promise((resolve) => {
    setTimeout(resolve, 1200)
  })
  note.value = next ? 'The board is shared with the team.' : 'Sharing stopped.'
}
</script>

<template>
  <div class="toggle-button-preview">
    <div class="toggle-button-preview__row">
      <ToggleButton elevation="low" label="Small" size="sm" />
      <ToggleButton elevation="low" label="Medium" />
      <ToggleButton elevation="low" label="Large" size="lg" />
    </div>
    <div class="toggle-button-preview__row">
      <ToggleButton is-disabled label="Disabled" />
      <ToggleButton is-loading label="Saving" />
    </div>
    <div class="toggle-button-preview__row">
      <ToggleButton
        v-model:is-pressed="isShared"
        label="Share with team"
        :pressed-change-action="shareWithTeam"
      >
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-upload" />
        </template>
      </ToggleButton>
      <span v-if="note" class="toggle-button-preview__note">{{ note }}</span>
    </div>
  </div>
</template>
