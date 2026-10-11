<script setup lang="ts">
import { MobileNav, MobileNavToggle } from '@astryx-vue/core/MobileNav'
import { SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <MobileNavToggle v-model:is-open="open" controls="docs-mobile-nav" label="Open Navigation" />
    <MobileNav id="docs-mobile-nav" v-model:is-open="open" header="Navigation" side="start">
      <SideNavSection title="Main">
        <SideNavItem href="#dashboard" icon-class="i-carbon-home" is-selected label="Dashboard" />
        <SideNavItem href="#projects" icon-class="i-carbon-folder" label="Projects" />
        <SideNavItem href="#analytics" icon-class="i-carbon-analytics" label="Analytics" />
      </SideNavSection>
      <SideNavSection title="Settings">
        <SideNavItem href="#settings" icon-class="i-carbon-settings" label="General" />
        <SideNavItem href="#team" icon-class="i-carbon-group" label="Team" />
      </SideNavSection>
    </MobileNav>
  </div>
</template>
