<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const query = ref('')
const filter = ref('design systems')
</script>

<template>
  <div style="width: 300px; max-width: 100%">
    <VStack :gap="3">
      <TextInput v-model="query" label="Search field" placeholder="Search projects…" has-clear>
        <template #icon>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </template>
      </TextInput>
      <TextInput v-model="filter" label="Search field with value" placeholder="Filter…" has-clear>
        <template #icon>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </template>
      </TextInput>
    </VStack>
  </div>
</template>
