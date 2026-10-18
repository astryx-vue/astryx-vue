<script setup lang="ts">
import { ContextMenu, ContextMenuItem } from '@astryx-vue/core/ContextMenu'
</script>

<template>
  <div class="context-menu-item-preview">
    <ContextMenu label="File actions">
      <div class="context-menu-item-preview__trigger">
        Right-click this area
      </div>
      <template #content>
        <ContextMenuItem description="Modify this item" label="Edit" />
        <ContextMenuItem description="Create a copy" label="Duplicate" />
        <ContextMenuItem description="This action cannot be undone" label="Delete" />
      </template>
    </ContextMenu>
  </div>
</template>
