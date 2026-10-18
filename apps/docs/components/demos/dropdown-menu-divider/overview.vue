<script setup lang="ts">
import { DropdownMenuDivider, DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
</script>

<template>
  <div class="dropdown-menu-preview">
    <div aria-label="Actions" class="astryx-dropdown-menu dropdown-menu-preview__surface" role="menu">
      <DropdownMenuItem label="Duplicate project" />
      <DropdownMenuItem label="Move to archive" />
      <DropdownMenuDivider />
      <DropdownMenuItem label="Delete project" variant="destructive" />
    </div>
  </div>
</template>
