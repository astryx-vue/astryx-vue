<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { NavIcon } from '@astryx-vue/core/NavItem'
import { TopNav, TopNavHeading, TopNavItem, TopNavMenu } from '@astryx-vue/core/TopNav'
</script>

<template>
  <div class="nav-frame">
    <TopNav label="Main navigation">
      <template #heading>
        <TopNavHeading heading="My App" href="#home">
          <template #icon>
            <NavIcon icon-class="i-carbon-cube" />
          </template>
        </TopNavHeading>
      </template>
      <TopNavItem href="#home" is-selected label="Home" />
      <TopNavMenu
        label="Products"
        :items="[
          { description: 'Track and analyze user behavior', href: '#analytics', iconClass: 'i-carbon-analytics', label: 'Analytics' },
          { description: 'Enterprise-grade protection', href: '#security', iconClass: 'i-carbon-security', label: 'Security' },
          { description: 'Streamline your workflows', href: '#automation', iconClass: 'i-carbon-flash', label: 'Automation' },
          { description: 'APIs, SDKs, and CLI tools', href: '#dev-tools', iconClass: 'i-carbon-code', label: 'Developer Tools' },
        ]"
      />
      <TopNavItem href="#pricing" label="Pricing" />
      <template #end>
        <Button is-icon-only label="Profile" variant="ghost">
          <template #icon>
            <span class="i-carbon-user" />
          </template>
        </Button>
      </template>
    </TopNav>
  </div>
</template>
