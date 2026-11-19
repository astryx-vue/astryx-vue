<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { TopNav, TopNavHeading, TopNavItem, TopNavMegaMenu, TopNavMegaMenuFeaturedCard, TopNavMegaMenuItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <div class="top-nav-mega-menu-overview">
    <TopNav label="Mega menu demo">
      <template #heading>
        <TopNavHeading heading="DevTools" />
      </template>
      <TopNavItem href="#" is-selected label="Overview" />
      <TopNavMegaMenu label="Products">
        <TopNavMegaMenuItem
          description="Ship to production in seconds"
          href="#deploy"
          icon-class="i-heroicons-rocket-launch"
          title="Deploy"
        />
        <TopNavMegaMenuItem
          description="Guides, references, and tutorials"
          href="#docs"
          icon-class="i-heroicons-book-open"
          title="Documentation"
        />
        <TopNavMegaMenuItem
          description="Programmatic access to all features"
          href="#api"
          icon-class="i-heroicons-code-bracket"
          title="API"
        />
        <TopNavMegaMenuItem
          description="Enterprise-grade protection"
          href="#security"
          icon-class="i-heroicons-shield-check"
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
      <template #end>
        <Icon icon="i-heroicons-magnifying-glass" class="top-nav-mega-menu-overview__search" />
      </template>
    </TopNav>
  </div>
</template>

<style scoped>
.top-nav-mega-menu-overview {
  width: 600px;
  max-width: 100%;
}

.top-nav-mega-menu-overview__search {
  width: 20px;
  height: 20px;
}
</style>
