<script setup lang="ts">
import { ContextMenuDivider, ContextMenuItem } from '@astryx-vue/core/ContextMenu'
</script>

<template>
  <div class="context-menu-preview">
    <div class="context-menu-preview__stage">
      <div
        aria-label="Context menu"
        class="astryx-context-menu context-menu-preview__surface"
        role="menu"
      >
        <ContextMenuItem description="Open this row in the editor" label="Edit">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-tools" />
          </template>
        </ContextMenuItem>
        <ContextMenuItem label="Duplicate">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-copy" />
          </template>
        </ContextMenuItem>
        <ContextMenuDivider />
        <ContextMenuItem label="Delete" variant="destructive" />
      </div>
      <p class="context-menu-preview__hint">
        The panel opens at the pointer, right where the action is needed: on a right-click, on the
        context-menu key, or on a long press.
      </p>
    </div>
  </div>
</template>
