<script setup lang="ts">
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@astryx-vue/core/DropdownMenu'
</script>

<template>
  <div class="dropdown-menu-preview">
    <div aria-label="Radio group" class="astryx-dropdown-menu dropdown-menu-preview__surface" role="menu">
      <DropdownMenuRadioGroup label="Radio group" model-value="option-1">
        <DropdownMenuRadioItem label="Option 1" value="option-1" />
      </DropdownMenuRadioGroup>
    </div>
  </div>
</template>
