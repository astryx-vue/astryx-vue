<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { MobileNav } from '@astryx-vue/core/MobileNav'
import { SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <Button label="Open from Right" @click="open = true" />
    <MobileNav id="docs-mobile-nav-end" v-model:is-open="open" header="Settings" side="end">
      <SideNavSection title="Settings">
        <SideNavItem href="#settings" icon-class="i-carbon-settings" label="General" />
        <SideNavItem href="#team" icon-class="i-carbon-group" label="Team" />
      </SideNavSection>
    </MobileNav>
  </div>
</template>
