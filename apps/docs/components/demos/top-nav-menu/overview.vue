<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Icon } from '@astryx-vue/core/Icon'
import { useToast } from '@astryx-vue/core/Toast'
import { TopNav, TopNavHeading, TopNavItem, TopNavMenu } from '@astryx-vue/core/TopNav'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <div class="top-nav-menu-overview">
    <TopNav label="Menu demo">
      <template #heading>
        <TopNavHeading heading="Platform" />
      </template>
      <TopNavItem label="Home" href="#" is-selected />
      <TopNavMenu
        label="Tools"
        :items="[
          { label: 'Analytics', description: 'View traffic and engagement metrics', iconClass: 'i-heroicons-chart-bar', href: '#analytics' },
          { label: 'Team Members', description: 'Manage your team and permissions', iconClass: 'i-heroicons-users', href: '#team' },
          { label: 'Settings', description: 'Configure your workspace', iconClass: 'i-heroicons-cog-6-tooth', href: '#settings' },
        ]"
      />
      <template #end>
        <Button label="Search" variant="ghost" is-icon-only @click="demo('Search')">
          <template #icon>
            <Icon icon="i-heroicons-magnifying-glass" />
          </template>
        </Button>
      </template>
    </TopNav>
  </div>
</template>

<style scoped>
.top-nav-menu-overview {
  width: 600px;
  max-width: 100%;
}
</style>
