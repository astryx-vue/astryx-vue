<script setup lang="ts">
import { DropdownMenuItem, DropdownMenuSubMenu } from '@astryx-vue/core/DropdownMenu'
</script>

<template>
  <div class="dropdown-menu-preview">
    <div aria-label="Actions" class="astryx-dropdown-menu dropdown-menu-preview__surface" role="menu">
      <DropdownMenuItem label="Rename" />
      <DropdownMenuSubMenu label="Move to">
        <DropdownMenuItem label="Projects" />
        <DropdownMenuItem label="Archive" />
        <DropdownMenuItem label="Trash" />
      </DropdownMenuSubMenu>
      <DropdownMenuItem label="Delete" variant="destructive" />
    </div>
  </div>
</template>
