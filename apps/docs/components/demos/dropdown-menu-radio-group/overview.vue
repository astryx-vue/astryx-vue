<script setup lang="ts">
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@astryx-vue/core/DropdownMenu'
</script>

<template>
  <div class="dropdown-menu-preview">
    <div aria-label="Sort" class="astryx-dropdown-menu dropdown-menu-preview__surface" role="menu">
      <DropdownMenuRadioGroup label="Sort by" model-value="newest">
        <DropdownMenuRadioItem label="Newest" value="newest" />
        <DropdownMenuRadioItem label="Oldest" value="oldest" />
      </DropdownMenuRadioGroup>
    </div>
  </div>
</template>
