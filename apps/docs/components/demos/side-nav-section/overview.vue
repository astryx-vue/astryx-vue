<script setup lang="ts">
import { SideNav, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
</script>

<template>
  <SideNav>
    <SideNavSection title="Overview">
      <SideNavItem href="#" icon-class="i-heroicons-home" is-selected label="Dashboard" />
      <SideNavItem href="#" icon-class="i-heroicons-chart-bar" label="Analytics" />
    </SideNavSection>
    <SideNavSection title="Account">
      <SideNavItem href="#" icon-class="i-heroicons-user" label="Profile" />
      <SideNavItem href="#" icon-class="i-heroicons-cog-6-tooth" label="Settings" />
    </SideNavSection>
  </SideNav>
</template>
