<script setup lang="ts">
import { useContainerReveal } from '@astryx-vue/core'
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { ref } from 'vue'

const files = ref([
  { name: 'report.pdf', meta: 'Edited 2 hours ago' },
  { name: 'budget.xlsx', meta: 'Edited 2 hours ago' },
  { name: 'notes.txt', meta: 'Edited 2 hours ago' },
])

const reveal = useContainerReveal()
const container = reveal.containerProps({ hoverDelay: 150 })
const content = reveal.contentProps()

function remove(name: string): void {
  files.value = files.value.filter(file => file.name !== name)
}
</script>

<template>
  <ul class="reveal-preview">
    <li
      v-for="file in files"
      :key="file.name"
      class="reveal-preview__row"
      :class="container.class"
      :style="container.style"
    >
      <span class="reveal-preview__label">
        <span class="reveal-preview__name">{{ file.name }}</span>
        <span class="reveal-preview__meta">{{ file.meta }}</span>
      </span>
      <span class="reveal-preview__actions" :class="content.class">
        <IconButton label="Edit" size="sm" variant="ghost">
          <Icon icon="i-heroicons-pencil-square" />
        </IconButton>
        <IconButton label="Delete" size="sm" variant="ghost" @click="remove(file.name)">
          <Icon icon="i-heroicons-trash" />
        </IconButton>
      </span>
    </li>
  </ul>
</template>

<style scoped>
.reveal-preview {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  max-width: 420px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.reveal-preview__row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
  padding: 6px 10px;
  border-radius: 8px;
}

.reveal-preview__row:hover {
  background: var(--astryx-color-background-muted);
}

.reveal-preview__label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.reveal-preview__name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--astryx-color-text-primary);
}

.reveal-preview__meta {
  font-size: 0.75rem;
  color: var(--astryx-color-text-secondary);
}

.reveal-preview__actions {
  display: flex;
  align-items: center;
  gap: 2px;
  top: 0;
  bottom: 0;
  right: 10px;
}
</style>
