<script setup lang="ts">
import type { ThemeId } from './themeCatalog'
import { computed } from 'vue'
import ShowcaseTemplate from '../playground/pages/theme-showcase.vue'
import { themeEntry } from './themeCatalog'

type Variant = 'blue' | 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'

const props = defineProps<{
  theme: ThemeId
  colorMode: 'light' | 'dark'
}>()

/**
 * 原版主题页的徽标颜色按位置给：前三个是商品卡（库存表前三行同色），后三个是库存表后三行。
 * 数值照抄 astryx.atmeta.com/themes 上各主题的渲染结果。Chocolate 原版没有，沿用 Neutral。
 */
const VARIANTS: Record<ThemeId, Variant[]> = {
  neutral: ['blue', 'green', 'yellow', 'yellow', 'green', 'orange'],
  stone: ['blue', 'green', 'yellow', 'orange', 'green', 'orange'],
  gothic: ['blue', 'red', 'purple', 'orange', 'pink', 'green'],
  matcha: ['green', 'orange', 'blue', 'yellow', 'green', 'orange'],
  y2k: ['blue', 'green', 'purple', 'pink', 'pink', 'pink'],
  butter: ['yellow', 'orange', 'green', 'yellow', 'orange', 'green'],
  chocolate: ['blue', 'green', 'yellow', 'yellow', 'green', 'orange'],
}

const IMAGE_KEYS = ['watch', 'headphones', 'backpack', 'wallet', 'tumbler', 'throw_'] as const

const data = computed(() => {
  const entry = themeEntry(props.theme)
  const variants = VARIANTS[props.theme]
  const images: Record<string, string> = {}
  entry.stock.forEach((row, index) => {
    if (row.image)
      images[IMAGE_KEYS[index]!] = row.image
  })
  return {
    images,
    products: entry.products.map((product, index) => ({
      name: product.name,
      description: product.copy,
      badge: product.badge,
      badgeVariant: variants[index]!,
    })),
    inventoryRows: entry.stock.map((row, index) => ({
      id: String.fromCharCode(97 + index),
      name: row.item,
      meta: row.detail,
      available: row.available,
      location: row.location,
      tags: [{ label: row.tags, variant: variants[index]! }],
      imageKey: row.image ? IMAGE_KEYS[index] : undefined,
      thumbnailFallback: row.item.charAt(0),
      selected: index % 2 === 1,
    })),
  }
})
</script>

<template>
  <div
    class="theme-showcase astryx-demo"
    :data-astryx-theme="theme"
    :data-astryx-color-mode="colorMode"
  >
    <!-- 原版主题页渲染的是不带 AppShell 的 Store 版本（embedded）。Neutral 不传数据，用模板默认值；其他主题换上自己的商品。 -->
    <ShowcaseTemplate v-if="theme === 'neutral'" key="neutral" embedded />
    <ShowcaseTemplate
      v-else
      :key="theme"
      embedded
      :images="data.images"
      :products="data.products"
      :inventory-rows="data.inventoryRows"
    />
  </div>
</template>

<style scoped>
.theme-showcase {
  overflow: hidden;
  border: 1px solid var(--astryx-color-border-default, rgb(128 128 128 / 20%));
  border-radius: 16px;
  background: var(--astryx-color-background-body);
  color: var(--astryx-color-text-primary);
  font-family: var(--astryx-font-family-body);
}
</style>
