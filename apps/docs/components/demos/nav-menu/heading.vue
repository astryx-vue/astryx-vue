<script setup lang="ts">
import { NavMenu, NavMenuItem } from '@astryx-vue/core/NavMenu'
import { SideNav, SideNavHeading } from '@astryx-vue/core/SideNav'
</script>

<template>
  <div style="height: 100px">
    <SideNav>
      <template #header>
        <SideNavHeading heading="Acme Platform">
          <template #icon>
            <span class="i-carbon-grid css-icon css-icon--sm" />
          </template>
          <template #menu>
            <NavMenu label="Acme Platform" size="lg">
              <NavMenuItem href="/dashboard" label="Dashboard" />
              <NavMenuItem href="/analytics" label="Analytics" />
              <NavMenuItem href="/settings" label="Settings" />
            </NavMenu>
          </template>
        </SideNavHeading>
      </template>
    </SideNav>
  </div>
</template>
