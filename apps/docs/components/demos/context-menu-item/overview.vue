<script setup lang="ts">
import { ContextMenuItem } from '@astryx-vue/core/ContextMenu'
</script>

<template>
  <div class="context-menu-preview">
    <div class="context-menu-preview__stage">
      <div
        aria-label="Context menu"
        class="astryx-context-menu context-menu-preview__surface"
        role="menu"
      >
        <ContextMenuItem description="Modify this item" label="Edit">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-edit" />
          </template>
        </ContextMenuItem>
        <ContextMenuItem description="Create a copy" label="Duplicate">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-copy" />
          </template>
        </ContextMenuItem>
        <ContextMenuItem label="Share">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-share" />
          </template>
        </ContextMenuItem>
        <ContextMenuItem description="This action cannot be undone" label="Delete">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-trash-can" />
          </template>
        </ContextMenuItem>
      </div>
    </div>
  </div>
</template>
