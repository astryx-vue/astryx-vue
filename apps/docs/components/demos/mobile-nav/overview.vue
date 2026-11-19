<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Icon } from '@astryx-vue/core/Icon'
import { MobileNav } from '@astryx-vue/core/MobileNav'
import { SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Button label="Open Navigation" variant="ghost" is-icon-only @click="isOpen = true">
    <template #icon>
      <Icon icon="menu" color="inherit" />
    </template>
  </Button>
  <MobileNav v-model:is-open="isOpen" header="Navigation">
    <SideNavSection title="Main">
      <SideNavItem label="Dashboard" is-selected href="/dashboard" />
      <SideNavItem label="Projects" href="/projects" />
      <SideNavItem label="Analytics" href="/analytics" />
    </SideNavSection>
    <SideNavSection title="Settings">
      <SideNavItem label="General" href="/settings" />
      <SideNavItem label="Team" href="/team" />
    </SideNavSection>
  </MobileNav>
</template>
