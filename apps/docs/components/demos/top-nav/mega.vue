<script setup lang="ts">
import { TopNav, TopNavHeading, TopNavItem, TopNavMegaMenu, TopNavMegaMenuFeaturedCard, TopNavMegaMenuItem, TopNavMenu } from '@astryx-vue/core/TopNav'
</script>

<template>
  <div class="top-nav-preview">
    <TopNav mobile-query="(max-width: 800px)">
      <template #heading>
        <TopNavHeading heading="Northwind" href="#home">
          <template #icon>
            <span class="i-carbon-dashboard" />
          </template>
        </TopNavHeading>
      </template>
      <TopNavItem href="#inbox" is-selected label="Inbox" />
      <TopNavMenu
        label="Product"
        :items="[
          { description: 'Usage across teams', href: '#analytics', iconClass: 'i-carbon-analytics', label: 'Analytics' },
          { description: 'Shared files', href: '#library', iconClass: 'i-carbon-document', label: 'Library' },
        ]"
      />
      <TopNavMegaMenu label="Solutions">
        <TopNavMegaMenuItem description="Plan work across teams" href="#teams" icon-class="i-carbon-user" title="Teams" />
        <TopNavMegaMenuItem description="Ship a public site" href="#sites" icon-class="i-carbon-launch" title="Sites" />
        <template #featured>
          <TopNavMegaMenuFeaturedCard description="See how the navigation fits a product shell." href="#tour" title="Take a tour" />
        </template>
      </TopNavMegaMenu>
      <template #end>
        <TopNavItem href="#help" icon-class="i-carbon-help" is-icon-only label="Help" />
      </template>
    </TopNav>
  </div>
</template>
