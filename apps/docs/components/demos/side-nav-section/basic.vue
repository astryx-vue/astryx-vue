<script setup lang="ts">
import { SideNav, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
</script>

<template>
  <SideNav>
    <SideNavSection title="Overview">
      <SideNavItem href="#dashboard" icon-class="i-carbon-dashboard" is-selected label="Dashboard" />
      <SideNavItem href="#analytics" icon-class="i-carbon-chart-line" label="Analytics" />
    </SideNavSection>
    <SideNavSection title="Account">
      <SideNavItem href="#profile" icon-class="i-carbon-user" label="Profile" />
    </SideNavSection>
  </SideNav>
</template>
