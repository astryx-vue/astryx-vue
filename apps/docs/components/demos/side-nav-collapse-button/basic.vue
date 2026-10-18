<script setup lang="ts">
import { SideNav, SideNavCollapseButton, SideNavItem } from '@astryx-vue/core/SideNav'
</script>

<template>
  <SideNav :collapsible="{ hasButton: false }">
    <SideNavItem href="#home" icon-class="i-carbon-home" is-selected label="Home" />
    <SideNavItem href="#projects" icon-class="i-carbon-folder" label="Projects" />
    <template #footer>
      <SideNavCollapseButton />
    </template>
  </SideNav>
</template>
