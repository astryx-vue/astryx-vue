<script setup lang="ts">
import { TopNav, TopNavHeading, TopNavItem, TopNavMegaMenu, TopNavMegaMenuFeaturedCard, TopNavMegaMenuItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <TopNav label="Main navigation">
    <template #heading>
      <TopNavHeading heading="DevTools" href="#home" />
    </template>
    <TopNavItem href="#overview" is-selected label="Overview" />
    <TopNavMegaMenu label="Products">
      <TopNavMegaMenuItem
        description="Ship to production in seconds"
        href="#deploy"
        icon-class="i-carbon-rocket"
        title="Deploy"
      />
      <TopNavMegaMenuItem
        description="Guides, references, and tutorials"
        href="#documentation"
        icon-class="i-carbon-book"
        title="Documentation"
      />
      <TopNavMegaMenuItem
        description="Programmatic access to all features"
        href="#api"
        icon-class="i-carbon-code"
        title="API"
      />
      <TopNavMegaMenuItem
        description="Enterprise-grade protection"
        href="#security"
        icon-class="i-carbon-security"
        title="Security"
      />
      <template #featured>
        <TopNavMegaMenuFeaturedCard
          description="Check out our latest features and improvements in the Q2 release."
          link-href="#changelog"
          link-label="Read the changelog"
          title="What's New"
        />
      </template>
    </TopNavMegaMenu>
  </TopNav>
</template>
