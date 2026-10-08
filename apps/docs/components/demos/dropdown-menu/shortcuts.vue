<script setup lang="ts">
import { DropdownMenu, DropdownMenuDivider, DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
import { IconButton } from '@astryx-vue/core/IconButton'
import { Kbd } from '@astryx-vue/core/Kbd'
import { ref } from 'vue'

const lastAction = ref('No action yet')
</script>

<template>
  <div class="dropdown-menu-preview">
    <DropdownMenu>
      <template #trigger="triggerProps">
        <IconButton v-bind="triggerProps" icon="i-carbon-overflow-menu-horizontal" label="More actions" variant="ghost" />
      </template>

      <DropdownMenuItem
        description="Rename, move, or change the cover"
        label="Edit project"
        @click="lastAction = 'Edit project'"
      >
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-tools" />
        </template>
      </DropdownMenuItem>
      <DropdownMenuItem label="Duplicate project" @click="lastAction = 'Duplicate project'">
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-copy" />
        </template>
        <template #endContent>
          <Kbd keys="mod+d" />
        </template>
      </DropdownMenuItem>
      <DropdownMenuDivider />
      <DropdownMenuItem
        description="This cannot be undone"
        label="Delete project"
        variant="destructive"
        @click="lastAction = 'Delete project'"
      >
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-trash-can" />
        </template>
      </DropdownMenuItem>
    </DropdownMenu>

    <p class="dropdown-menu-preview__note">
      Last action: {{ lastAction }}
    </p>
  </div>
</template>
