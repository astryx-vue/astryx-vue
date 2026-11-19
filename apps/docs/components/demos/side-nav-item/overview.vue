<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { SideNav, SideNavItem } from '@astryx-vue/core/SideNav'
</script>

<template>
  <SideNav>
    <SideNavItem href="#" icon-class="i-heroicons-inbox" is-selected label="Inbox">
      <template #end>
        <Badge label="12" />
      </template>
    </SideNavItem>
    <SideNavItem href="#" icon-class="i-heroicons-document" label="Documents" />
    <SideNavItem href="#" icon-class="i-heroicons-cog-6-tooth" is-disabled label="Settings" />
  </SideNav>
</template>
