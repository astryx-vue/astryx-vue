<script setup lang="ts">
import { DropdownMenu, DropdownMenuDivider, DropdownMenuGroup, DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
</script>

<template>
  <DropdownMenu :button="{ label: 'Version' }">
    <DropdownMenuGroup title="Version history">
      <DropdownMenuItem icon="arrowDown" label="Restore this version" />
      <DropdownMenuItem icon="copy" label="Compare with current" />
    </DropdownMenuGroup>
    <DropdownMenuDivider />
    <DropdownMenuGroup title="Add to message">
      <DropdownMenuItem icon="externalLink" label="As a link" />
      <DropdownMenuItem label="As a snippet" />
    </DropdownMenuGroup>
  </DropdownMenu>
</template>
