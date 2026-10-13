<script setup lang="ts">
import { ComplexSelector } from '@astryx-vue/core/ComplexSelector'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const saved = ref('Design')
const blocked = ref('Archive')

async function save(next: string) {
  await new Promise(resolve => setTimeout(resolve, 600))
  saved.value = next
}
</script>

<template>
  <VStack :gap="4">
    <ComplexSelector
      v-model="saved"
      :change-action="save"
      label="Workspace"
      :status="{ type: 'success', message: 'Saved to the team directory.' }"
      :trigger-label="saved"
    >
      <template #default="{ commit, close }">
        <VStack :gap="2">
          <button type="button" @click="commit('Design'); close()">
            Design
          </button>
          <button type="button" @click="commit('Research'); close()">
            Research
          </button>
        </VStack>
      </template>
    </ComplexSelector>
    <ComplexSelector
      v-model="blocked"
      is-disabled
      label="Locked folder"
      :status="{ type: 'error', message: 'You do not have access to this folder.' }"
      trigger-label="Archive"
    >
      <p>Archive</p>
    </ComplexSelector>
  </VStack>
</template>
