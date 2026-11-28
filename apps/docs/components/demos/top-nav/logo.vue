<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { NavIcon } from '@astryx-vue/core/NavItem'
import { useToast } from '@astryx-vue/core/Toast'
import { TopNav, TopNavHeading, TopNavItem } from '@astryx-vue/core/TopNav'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
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
      <TopNavItem href="#overview" is-selected label="Overview" />
      <TopNavItem href="#analytics" label="Analytics" />
      <TopNavItem href="#reports" label="Reports" />
      <template #end>
        <Button is-icon-only label="Profile" variant="ghost" @click="demo('Profile')">
          <template #icon>
            <span class="i-carbon-user" />
          </template>
        </Button>
      </template>
    </TopNav>
  </div>
</template>
