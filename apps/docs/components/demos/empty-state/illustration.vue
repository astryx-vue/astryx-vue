<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { EmptyState } from '@astryx-vue/core/EmptyState'
</script>

<template>
  <div class="empty-state-preview__grid">
    <div class="empty-state-preview__cell">
      <div class="empty-state-preview__panel">
        <EmptyState
          title="No files to show"
          description="Upload a file, or wait for a teammate to share one."
        >
          <template #icon>
            <span class="css-icon css-icon--lg i-carbon-upload" />
          </template>
          <template #actions>
            <Button label="Upload file" variant="secondary" />
          </template>
        </EmptyState>
      </div>
      <span class="empty-state-preview__caption">An icon class in the icon slot</span>
    </div>

    <div class="empty-state-preview__cell">
      <div class="empty-state-preview__panel">
        <EmptyState
          title="No projects yet"
          description="Projects keep tasks, files, and discussions in one place."
        >
          <template #icon>
            <svg
              class="empty-state-preview__illustration"
              width="56"
              height="56"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M8 18a4 4 0 0 1 4-4h12l6 6h22a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" />
              <path d="M20 40h24" />
              <path d="M20 32h16" />
            </svg>
          </template>
          <template #actions>
            <Button label="New project" variant="primary" />
          </template>
        </EmptyState>
      </div>
      <span class="empty-state-preview__caption">A custom illustration in the icon slot</span>
    </div>
  </div>
</template>
