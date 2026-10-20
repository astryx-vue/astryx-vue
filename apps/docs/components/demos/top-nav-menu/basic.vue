<script setup lang="ts">
import { TopNav, TopNavHeading, TopNavItem, TopNavMenu } from '@astryx-vue/core/TopNav'
</script>

<template>
  <TopNav label="Main navigation">
    <template #heading>
      <TopNavHeading heading="Platform" />
    </template>
    <TopNavItem href="#" is-selected label="Home" />
    <TopNavMenu
      label="Tools"
      :items="[
        { description: 'View traffic and engagement metrics', href: '#analytics', iconClass: 'i-carbon-analytics', label: 'Analytics' },
        { description: 'Configure your workspace', href: '#settings', iconClass: 'i-carbon-settings', label: 'Settings' },
      ]"
    />
  </TopNav>
</template>
