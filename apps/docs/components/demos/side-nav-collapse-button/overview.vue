<script setup lang="ts">
import { SideNav, SideNavCollapseButton, SideNavHeading, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
</script>

<template>
  <SideNav class="side-nav-collapse-button-overview" :collapsible="{ hasButton: false }">
    <template #header>
      <SideNavHeading heading="Workspace" />
    </template>
    <SideNavSection title="Main">
      <SideNavItem href="#" icon-class="i-heroicons-home" is-selected label="Home" />
      <SideNavItem href="#" icon-class="i-heroicons-folder" label="Projects" />
    </SideNavSection>
    <template #footer-icons>
      <SideNavCollapseButton />
    </template>
  </SideNav>
</template>
