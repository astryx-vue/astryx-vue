<script setup lang="ts">
import {
  AppShell,
  Badge,
  Button,
  Card,
  Grid,
  Icon,
  IconButton,
  NavIcon,
  Stack,
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMegaMenu,
  TopNavMegaMenuFeaturedCard,
  TopNavMegaMenuItem,
  VStack,
} from '@astryx-vue/core'

interface MegaItem {
  name: string
  tagline: string
  iconClass: string
}

const SHOP_ITEMS: MegaItem[] = [
  { name: 'New Arrivals', tagline: 'The latest drops', iconClass: 'i-heroicons-sparkles' },
  { name: 'Womenswear', tagline: 'Dresses, knitwear & more', iconClass: 'i-heroicons-swatch' },
  { name: 'Menswear', tagline: 'Shirts, tailoring & more', iconClass: 'i-heroicons-tag' },
  { name: 'Home', tagline: 'Bedding, lighting & décor', iconClass: 'i-heroicons-home-modern' },
  { name: 'Beauty', tagline: 'Skincare, fragrance & makeup', iconClass: 'i-heroicons-face-smile' },
  { name: 'Accessories', tagline: 'Bags, hats & sunglasses', iconClass: 'i-heroicons-shopping-bag' },
  { name: 'Sale', tagline: 'Up to 50% off', iconClass: 'i-heroicons-receipt-percent' },
  { name: 'Gift Cards', tagline: 'The perfect present', iconClass: 'i-heroicons-gift' },
]

const BRAND_ITEMS: MegaItem[] = [
  { name: 'Aether', tagline: 'Performance essentials', iconClass: 'i-heroicons-sparkles' },
  { name: 'Northwind', tagline: 'Outdoor & technical', iconClass: 'i-heroicons-cloud' },
  { name: 'Loomwell', tagline: 'Everyday knitwear', iconClass: 'i-heroicons-bolt' },
  { name: 'Verdant', tagline: 'Sustainable basics', iconClass: 'i-heroicons-sun' },
  { name: 'Studio Mara', tagline: 'Modern tailoring', iconClass: 'i-heroicons-star' },
  { name: 'Atelier Kos', tagline: 'Limited ateliers', iconClass: 'i-heroicons-fire' },
  { name: 'Rue & Co', tagline: 'City streetwear', iconClass: 'i-heroicons-globe-alt' },
  { name: 'Halden', tagline: 'Minimal staples', iconClass: 'i-heroicons-moon' },
]

const CATEGORY_TILES = [
  'New Arrivals',
  'Womenswear',
  'Menswear',
  'Home & Living',
  'Beauty',
  'Accessories',
]
</script>

<template>
  <AppShell variant="surface" :content-padding="6">
    <template #topNav>
      <TopNav label="Lumen storefront navigation">
        <template #heading>
          <TopNavHeading heading="Lumen" href="#">
            <template #icon>
              <NavIcon>
                <Icon icon="i-heroicons-shopping-bag" size="sm" />
              </NavIcon>
            </template>
          </TopNavHeading>
        </template>
        <TopNavMegaMenu label="Shop">
          <Stack class="mega-items">
            <Grid :columns="2" :gap="2">
              <TopNavMegaMenuItem
                v-for="item in SHOP_ITEMS"
                :key="item.name"
                :title="item.name"
                :description="item.tagline"
                :icon-class="item.iconClass"
                href="#"
              />
            </Grid>
          </Stack>
          <template #featured>
            <Stack class="mega-featured">
              <TopNavMegaMenuFeaturedCard
                title="The Autumn Edit"
                description="Layering staples in warm, earthy tones."
                href="#autumn-edit"
              >
                <img
                  class="mega-featured__image"
                  src="/template-assets/illustrative-horizontal-1.png"
                  alt="Autumn collection lookbook"
                >
              </TopNavMegaMenuFeaturedCard>
            </Stack>
          </template>
        </TopNavMegaMenu>
        <TopNavMegaMenu label="Brands">
          <Stack class="mega-items">
            <Grid :columns="2" :gap="2">
              <TopNavMegaMenuItem
                v-for="item in BRAND_ITEMS"
                :key="item.name"
                :title="item.name"
                :description="item.tagline"
                :icon-class="item.iconClass"
                href="#"
              />
            </Grid>
          </Stack>
          <template #featured>
            <Stack class="mega-featured">
              <TopNavMegaMenuFeaturedCard
                title="Meet Studio Mara"
                description="Modern tailoring, made to last."
                href="#studio-mara"
              >
                <img
                  class="mega-featured__image"
                  src="/template-assets/light-scene-horizontal-1.png"
                  alt="Studio Mara lookbook"
                >
              </TopNavMegaMenuFeaturedCard>
            </Stack>
          </template>
        </TopNavMegaMenu>
        <TopNavItem label="Sale" href="#" />
        <TopNavItem label="Service" href="#" />
        <template #end>
          <IconButton label="Search products" tooltip="Search" variant="ghost">
            <Icon icon="i-heroicons-magnifying-glass" size="sm" />
          </IconButton>
          <Button label="Sign in" variant="ghost" />
          <Button label="Checkout" variant="primary">
            <template #icon>
              <Icon icon="i-heroicons-shopping-cart" size="sm" />
            </template>
            <template #end>
              <Badge label="3" />
            </template>
          </Button>
        </template>
      </TopNav>
    </template>

    <VStack class="content-max" :gap="10">
      <Card variant="muted" :padding="0" width="100%" :height="360" />

      <VStack v-for="section in 3" :key="section" :gap="4">
        <Card variant="muted" :padding="0" :width="200" :height="24" />
        <Grid :columns="{ minWidth: 160, repeat: 'fit' }" :gap="4">
          <VStack v-for="tile in CATEGORY_TILES" :key="`${section}-${tile}`" :gap="2">
            <Card variant="muted" :padding="0" width="100%" :height="120" />
            <Card variant="muted" :padding="0" width="60%" :height="14" />
          </VStack>
        </Grid>
      </VStack>
    </VStack>
  </AppShell>
</template>

<style scoped>
.content-max {
  max-width: 1100px;
  margin-inline: auto;
}

.mega-items {
  grid-column: 1 / -1;
  width: 520px;
}

.mega-featured {
  width: 240px;
}

.mega-featured__image {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
}
</style>
