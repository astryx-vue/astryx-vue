<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { EmptyState } from '@astryx-vue/core/EmptyState'
</script>

<template>
  <div class="empty-state-preview__grid">
    <div class="empty-state-preview__cell">
      <div class="empty-state-preview__panel">
        <EmptyState
          title="No projects yet"
          description="Projects keep tasks, files, and discussions in one place."
        >
          <template #icon>
            <span class="css-icon css-icon--lg i-carbon-column" />
          </template>
          <template #actions>
            <Button label="New project" variant="primary" />
          </template>
        </EmptyState>
      </div>
      <span class="empty-state-preview__caption">Default spacing</span>
    </div>

    <div class="empty-state-preview__cell">
      <div class="empty-state-preview__panel">
        <EmptyState
          title="No projects yet"
          description="Projects keep tasks, files, and discussions in one place."
          is-compact
        >
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-column" />
          </template>
          <template #actions>
            <Button label="New project" variant="primary" size="sm" />
          </template>
        </EmptyState>
      </div>
      <span class="empty-state-preview__caption">Compact, for cards and sidebars</span>
    </div>
  </div>
</template>
