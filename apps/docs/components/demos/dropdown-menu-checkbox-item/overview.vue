<script setup lang="ts">
import { DropdownMenuCheckboxItem } from '@astryx-vue/core/DropdownMenu'
</script>

<template>
  <div class="dropdown-menu-preview">
    <div aria-label="View" class="astryx-dropdown-menu dropdown-menu-preview__surface" role="menu">
      <DropdownMenuCheckboxItem label="Show archived" :model-value="true" />
      <DropdownMenuCheckboxItem label="Compact rows" :model-value="false" />
    </div>
  </div>
</template>
