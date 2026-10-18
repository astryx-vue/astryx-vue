<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { SideNav, SideNavItem } from '@astryx-vue/core/SideNav'
</script>

<template>
  <SideNav>
    <SideNavItem href="#inbox" icon-class="i-carbon-email" is-selected label="Inbox">
      <template #end>
        <Badge variant="neutral">
          12
        </Badge>
      </template>
    </SideNavItem>
    <SideNavItem href="#documents" icon-class="i-carbon-document" label="Documents" />
    <SideNavItem icon-class="i-carbon-settings" is-disabled label="Settings" />
  </SideNav>
</template>
