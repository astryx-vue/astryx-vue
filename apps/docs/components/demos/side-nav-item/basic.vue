<script setup lang="ts">
import { SideNav, SideNavItem } from '@astryx-vue/core/SideNav'
</script>

<template>
  <SideNav>
    <SideNavItem href="#inbox" icon-class="i-carbon-email" is-selected label="Inbox" />
    <SideNavItem href="#documents" icon-class="i-carbon-document" label="Documents" />
  </SideNav>
</template>
