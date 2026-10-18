<script setup lang="ts">
import { ChatComposer, ChatComposerDrawer } from '@astryx-vue/core/Chat'
import { Token } from '@astryx-vue/core/Token'
import { ref } from 'vue'

const files = ref([
  'feature-prd.docx',
  '2026-roadmap.pdf',
  'user-flow.fig',
  'launch-plan.docx',
  'user-feedback.csv',
  'analytics-kpis.csv',
])

function remove(name: string): void {
  files.value = files.value.filter(item => item !== name)
}
</script>

<template>
  <ChatComposer>
    <template #drawer>
      <ChatComposerDrawer :count="files.length">
        <Token
          v-for="name in files"
          :key="name"
          removable
          :label="name"
          @remove="remove(name)"
        />
      </ChatComposerDrawer>
    </template>
  </ChatComposer>
</template>
