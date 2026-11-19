<script setup lang="ts">
import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
</script>

<template>
  <SideNav>
    <template #header>
      <SideNavHeading heading="My App" heading-href="#home" />
    </template>
    <SideNavSection title="Main">
      <SideNavItem href="#dashboard" icon-class="i-heroicons-home" is-selected label="Dashboard" />
      <SideNavItem href="#projects" icon-class="i-heroicons-folder" label="Projects" />
      <SideNavItem href="#analytics" icon-class="i-heroicons-chart-bar" label="Analytics" />
    </SideNavSection>
    <SideNavSection title="Documents">
      <SideNavItem href="#documents" icon-class="i-heroicons-document-text" label="All Documents" />
    </SideNavSection>
  </SideNav>
</template>
