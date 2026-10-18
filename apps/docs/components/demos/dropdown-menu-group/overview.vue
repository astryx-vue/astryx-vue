<script setup lang="ts">
import { DropdownMenuGroup, DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
</script>

<template>
  <div class="dropdown-menu-preview">
    <div aria-label="View" class="astryx-dropdown-menu dropdown-menu-preview__surface" role="menu">
      <DropdownMenuGroup title="View">
        <DropdownMenuItem label="Show archived" />
        <DropdownMenuItem label="Compact rows" />
      </DropdownMenuGroup>
      <DropdownMenuGroup title="Sort">
        <DropdownMenuItem label="Newest first" />
        <DropdownMenuItem label="Oldest first" />
      </DropdownMenuGroup>
    </div>
  </div>
</template>
