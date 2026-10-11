<script setup lang="ts">
import { SideNav, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <div class="side-nav-preview">
    <SideNav v-model:is-collapsed="collapsed" collapsible>
      <template #header>
        <span class="side-nav-preview__mark" aria-hidden="true">
          <span class="i-carbon-dashboard" />
        </span>
      </template>
      <SideNavSection title="Workspace">
        <SideNavItem href="#home" icon-class="i-carbon-home" is-selected label="Home" />
        <SideNavItem href="#files" icon-class="i-carbon-folder" label="Files">
          <SideNavItem href="#files-recent" label="Recent" />
          <SideNavItem href="#files-shared" label="Shared" />
        </SideNavItem>
        <SideNavItem href="#mail" icon-class="i-carbon-email" label="Mail" />
      </SideNavSection>
      <template #footer>
        <SideNavItem href="#settings" icon-class="i-carbon-settings" label="Settings" />
      </template>
    </SideNav>
  </div>
</template>
