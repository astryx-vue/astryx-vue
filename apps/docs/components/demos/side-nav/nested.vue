<script setup lang="ts">
import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
</script>

<template>
  <div class="side-nav-preview">
    <SideNav>
      <template #header>
        <SideNavHeading heading="My App" />
      </template>
      <SideNavSection title="Main">
        <SideNavItem href="#dashboard" icon-class="i-carbon-home" is-selected label="Dashboard" />
        <SideNavItem icon-class="i-carbon-settings" label="Settings">
          <SideNavItem href="#settings-general" label="General" />
          <SideNavItem href="#settings-security" label="Security" />
          <SideNavItem href="#settings-notifications" label="Notifications" />
        </SideNavItem>
      </SideNavSection>
    </SideNav>
  </div>
</template>
