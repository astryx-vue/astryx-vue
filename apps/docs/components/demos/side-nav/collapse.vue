<script setup lang="ts">
import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <div class="side-nav-preview">
    <SideNav v-model:is-collapsed="collapsed" collapsible>
      <template #header>
        <SideNavHeading heading="Workspace" />
      </template>
      <SideNavSection title="Main">
        <SideNavItem href="#home" icon-class="i-carbon-home" is-selected label="Home" />
        <SideNavItem href="#files" icon-class="i-carbon-folder" label="Files" />
        <SideNavItem href="#mail" icon-class="i-carbon-email" label="Mail" />
      </SideNavSection>
    </SideNav>
  </div>
</template>
