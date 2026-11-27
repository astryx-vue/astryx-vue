<script setup lang="ts">
import { NavHeadingMenu, NavHeadingMenuItem } from '@astryx-vue/core/NavMenu'
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
            <NavHeadingMenu label="Acme Platform" size="lg">
              <NavHeadingMenuItem href="/dashboard" label="Dashboard" />
              <NavHeadingMenuItem href="/analytics" label="Analytics" />
              <NavHeadingMenuItem href="/settings" label="Settings" />
            </NavHeadingMenu>
          </template>
        </SideNavHeading>
      </template>
    </SideNav>
  </div>
</template>
