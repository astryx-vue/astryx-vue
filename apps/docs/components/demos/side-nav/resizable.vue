<script setup lang="ts">
import { SideNav, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
</script>

<template>
  <div class="side-nav-preview" style="width: min(100%, 32rem); height: 280px">
    <SideNav collapsible resizable>
      <SideNavSection title="Library">
        <SideNavItem href="#home" icon-class="i-carbon-home" is-selected label="Home" />
        <SideNavItem href="#files" icon-class="i-carbon-folder" label="Files" />
        <SideNavItem href="#mail" icon-class="i-carbon-email" label="Mail" />
      </SideNavSection>
    </SideNav>
  </div>
</template>
