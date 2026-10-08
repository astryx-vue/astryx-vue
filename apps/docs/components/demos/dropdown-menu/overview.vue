<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { DropdownMenuDivider, DropdownMenuGroup, DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
import { Kbd } from '@astryx-vue/core/Kbd'
</script>

<template>
  <div class="dropdown-menu-preview">
    <span class="astryx-dropdown-menu-trigger dropdown-menu-preview__trigger" data-open="true">
      <Button label="Actions" variant="secondary">
        <template #end>
          <span class="css-icon css-icon--sm i-carbon-chevron-down" />
        </template>
      </Button>
    </span>

    <div aria-label="Actions" class="astryx-dropdown-menu dropdown-menu-preview__surface" role="menu">
      <DropdownMenuGroup title="Project">
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
      </DropdownMenuGroup>

      <DropdownMenuDivider />

      <DropdownMenuItem
        description="Only you will see it again"
        label="Move to archive"
      >
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-view-off" />
        </template>
      </DropdownMenuItem>
      <DropdownMenuItem label="Delete project" variant="destructive">
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-trash-can" />
        </template>
      </DropdownMenuItem>
    </div>
  </div>
</template>
