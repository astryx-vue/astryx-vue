<script setup lang="ts">
import { DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
import { Kbd } from '@astryx-vue/core/Kbd'
</script>

<template>
  <div class="dropdown-menu-preview">
    <div aria-label="Actions" class="astryx-dropdown-menu dropdown-menu-preview__surface" role="menu">
      <DropdownMenuItem
        class="dropdown-menu-preview__highlight"
        description="Rename, move, or change the cover"
        label="Edit project"
      >
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-tools" />
        </template>
      </DropdownMenuItem>
      <DropdownMenuItem label="Duplicate project">
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-copy" />
        </template>
        <template #endContent>
          <Kbd keys="mod+d" />
        </template>
      </DropdownMenuItem>
      <DropdownMenuItem is-disabled label="Delete project" variant="destructive">
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-trash-can" />
        </template>
      </DropdownMenuItem>
    </div>
  </div>
</template>
