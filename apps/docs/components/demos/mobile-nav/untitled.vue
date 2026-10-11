<script setup lang="ts">
import { MobileNav, MobileNavToggle } from '@astryx-vue/core/MobileNav'
import { SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <MobileNavToggle v-model:is-open="open" controls="docs-mobile-nav-plain" label="Open Navigation" />
    <MobileNav id="docs-mobile-nav-plain" v-model:is-open="open" side="start">
      <SideNavSection title="Main">
        <SideNavItem href="#dashboard" icon-class="i-carbon-home" is-selected label="Dashboard" />
        <SideNavItem href="#projects" icon-class="i-carbon-folder" label="Projects" />
      </SideNavSection>
    </MobileNav>
  </div>
</template>
