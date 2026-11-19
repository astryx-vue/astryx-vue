<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Icon } from '@astryx-vue/core/Icon'
import { NavIcon } from '@astryx-vue/core/NavItem'
import { ToastViewport, useToast } from '@astryx-vue/core/Toast'
import { TopNav, TopNavHeading, TopNavItem } from '@astryx-vue/core/TopNav'

const showToast = useToast()
</script>

<template>
  <div class="top-nav-overview">
    <TopNav label="Main navigation">
      <template #heading>
        <TopNavHeading heading="My App">
          <template #logo>
            <NavIcon>
              <Icon icon="i-heroicons-cube" size="sm" />
            </NavIcon>
          </template>
        </TopNavHeading>
      </template>
      <TopNavItem label="Home" href="#" is-selected />
      <TopNavItem label="Products" href="#" />
      <TopNavItem label="About" href="#" />
      <template #end>
        <Button
          label="Search"
          variant="ghost"
          is-icon-only
          @click="showToast({ body: 'Demo: search would open here' })"
        >
          <template #icon>
            <Icon icon="search" color="inherit" />
          </template>
        </Button>
        <Button
          label="Notifications"
          variant="ghost"
          is-icon-only
          @click="showToast({ body: 'Demo: your notifications would open here' })"
        >
          <template #icon>
            <Icon icon="i-heroicons-bell" />
          </template>
        </Button>
        <Button
          label="Profile"
          variant="ghost"
          is-icon-only
          @click="showToast({ body: 'Demo: your profile menu would open here' })"
        >
          <template #icon>
            <Icon icon="i-heroicons-user-circle" />
          </template>
        </Button>
      </template>
    </TopNav>
  </div>
  <ToastViewport />
</template>

<style scoped>
.top-nav-overview {
  width: 600px;
  max-width: 100%;
}
</style>
