<script setup lang="ts">
import { SideNav, SideNavCollapseButton, SideNavHeading, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
</script>

<template>
  <SideNav class="side-nav-collapse-button-overview" :collapsible="{ hasButton: false }">
    <template #header>
      <SideNavHeading heading="Workspace" />
    </template>
    <SideNavSection title="Main">
      <SideNavItem href="#home" icon-class="i-carbon-home" is-selected label="Home" />
      <SideNavItem href="#projects" icon-class="i-carbon-folder" label="Projects" />
    </SideNavSection>
    <template #footer>
      <SideNavCollapseButton />
    </template>
  </SideNav>
</template>
