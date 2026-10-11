<script setup lang="ts">
import { MobileNav, MobileNavToggle } from '@astryx-vue/core/MobileNav'
import { NavItem } from '@astryx-vue/core/NavItem'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div class="mobile-nav-preview">
    <MobileNavToggle v-model:is-open="open" controls="docs-mobile-nav" />
    <MobileNav id="docs-mobile-nav" v-model:is-open="open" header="Menu" side="start">
      <NavItem block href="#home" icon-class="i-carbon-home" label="Home" />
      <NavItem block href="#files" icon-class="i-carbon-folder" label="Files" />
      <NavItem block href="#settings" icon-class="i-carbon-settings" label="Settings" />
    </MobileNav>
  </div>
</template>
