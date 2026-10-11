<script setup lang="ts">
import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
</script>

<template>
  <div class="side-nav-preview">
    <SideNav>
      <template #header>
        <SideNavHeading heading="My App" heading-href="#home" />
      </template>
      <SideNavSection title="Main">
        <SideNavItem href="#dashboard" icon-class="i-carbon-home" is-selected label="Dashboard" />
        <SideNavItem href="#projects" icon-class="i-carbon-folder" label="Projects" />
        <SideNavItem href="#analytics" icon-class="i-carbon-analytics" label="Analytics" />
      </SideNavSection>
      <SideNavSection title="Documents">
        <SideNavItem href="#documents" icon-class="i-carbon-document" label="All Documents" />
      </SideNavSection>
    </SideNav>
  </div>
</template>
