<script setup lang="ts">
import {
  AspectRatio,
  Badge,
  Button,
  Center,
  Collapsible,
  CollapsibleGroup,
  Divider,
  Grid,
  Heading,
  HStack,
  Layout,
  LayoutContent,
  NumberInput,
  SegmentedControl,
  SegmentedControlItem,
  SelectableCard,
  Text,
  VStack,
} from '@astryx-vue/core'
import type { Component } from 'vue'
import { computed, defineComponent, h, ref } from 'vue'

/** 线性图标用内联 SVG 画出，不依赖外部图标字体。 */
function strokeIcon(path: string): Component {
  return defineComponent({
    render: () => h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 1.5,
      'stroke-linecap': 'round',
      'aria-hidden': 'true',
      style: 'width:1em;height:1em',
    }, [h('path', { d: path })]),
  })
}

const MinusIcon = strokeIcon('M5 12h14')
const PlusIcon = strokeIcon('M12 5v14M5 12h14')

const IMAGES = [
  '/template-assets/light-product-1.png',
  '/template-assets/light-product-1.png',
  '/template-assets/light-product-2.png',
  '/template-assets/light-product-3.png',
  '/template-assets/light-product-4.png',
  '/template-assets/light-product-5.png',
  '/template-assets/light-product-3.png',
]

const PRODUCT = {
  name: 'Solstice Mug & Plate Set',
  price: 89.0,
  originalPrice: 119.0,
  description:
    'A hand-thrown mug and plate set that brings quiet warmth to every meal. The mug sits easy in the hand with a generous 12 oz capacity, while the 8-inch plate works for everything from toast to tapas. Each piece is kiln-fired at 2,300°F for a finish that resists chips and stains. Subtle variations in the reactive glaze mean no two sets are exactly alike. Dishwasher and microwave safe.',
  composition:
    'High-fire stoneware clay, wheel-thrown and trimmed by hand. Reactive glaze applied by dipping — color pools and breaks naturally over the clay body. Lead-free and food-safe. Unglazed foot ring reveals the raw clay underneath. Each piece is bisque-fired, glazed, then fired again to cone 10 in a gas reduction kiln.',
  deliveryReturns:
    'Free shipping on all ceramics orders over $75. Each piece is individually wrapped in recycled kraft paper and cushioned for transit. Returns accepted within 30 days — items must be unused and in original packaging. Replacement pieces available individually.',
  dimensions:
    'Mug height: 9.5 cm / 3.75 in. Mug diameter: 8.5 cm / 3.35 in. Capacity: 350 ml / 12 oz. Plate diameter: 20 cm / 8 in. Plate height: 2 cm / 0.75 in. Weight: 680 g / 1.5 lb (set).',
}

const COLORS = [
  { value: 'snow', label: 'Snow' },
  { value: 'sage', label: 'Sage' },
  { value: 'charcoal', label: 'Charcoal' },
]

const FINISHES = [
  { value: 'matte', label: 'Matte' },
  { value: 'satin', label: 'Satin' },
  { value: 'speckled', label: 'Speckled' },
]

const fmt = (n: number) => `$${n.toFixed(2)}`

const selectedThumb = ref(0)
const color = ref('snow')
const finish = ref('matte')
const quantity = ref<number | null>(1)

const heroSrc = computed(() => IMAGES[selectedThumb.value + 1] ?? IMAGES[0])
const thumbnails = IMAGES.slice(1)

function decrement() {
  quantity.value = Math.max(1, (quantity.value ?? 1) - 1)
}

function increment() {
  quantity.value = Math.min(10, (quantity.value ?? 1) + 1)
}

const filledStars = computed(() => Math.round(4.3))
</script>

<template>
  <Layout height="fill" :content-width="1200">
    <LayoutContent :padding="6">
      <Grid :columns="{ minWidth: 320, repeat: 'fit' }" :gap="5">
        <VStack :gap="3">
          <AspectRatio :ratio="4 / 5">
            <img class="hero-image" :src="heroSrc" :alt="PRODUCT.name">
          </AspectRatio>
          <Grid :columns="3" :gap="2">
            <AspectRatio v-for="(src, i) in thumbnails" :key="i" :ratio="1">
              <SelectableCard
                :label="`Product image ${i + 1}`"
                :is-selected="selectedThumb === i"
                variant="transparent"
                :padding="0"
                width="100%"
                height="100%"
                @change="selectedThumb = i"
              >
                <img class="thumb-image" :src="src" :alt="`Product image ${i + 1}`">
              </SelectableCard>
            </AspectRatio>
          </Grid>
        </VStack>

        <VStack :gap="0" class="sticky-info">
          <VStack :gap="5">
            <VStack :gap="2">
              <Heading :level="1" type="display-2">
                {{ PRODUCT.name }}
              </Heading>
              <HStack :gap="1" :align="'center'">
                <span
                  v-for="n in filledStars"
                  :key="`full-${n}`"
                  class="star star--filled"
                  aria-hidden="true"
                >★</span>
                <span
                  v-for="n in (5 - filledStars)"
                  :key="`empty-${n}`"
                  class="star"
                  aria-hidden="true"
                >☆</span>
                <Text type="body" color="secondary">
                  4.3 (128)
                </Text>
              </HStack>
              <HStack :gap="2" :align="'center'">
                <Text type="large" weight="bold">
                  {{ fmt(PRODUCT.price) }}
                </Text>
                <Text type="body" color="secondary" has-strikethrough>
                  {{ fmt(PRODUCT.originalPrice) }}
                </Text>
                <Badge variant="error" label="Sale" />
              </HStack>
            </VStack>
            <Text type="large">
              {{ PRODUCT.description }}
            </Text>
            <VStack :gap="2">
              <Text type="label">
                Glaze
              </Text>
              <VStack justify="start">
                <SegmentedControl v-model="color" label="Glaze">
                  <SegmentedControlItem
                    v-for="c in COLORS"
                    :key="c.value"
                    :value="c.value"
                    :label="c.label"
                  />
                </SegmentedControl>
              </VStack>
            </VStack>
            <VStack :gap="2">
              <Text type="label">
                Finish
              </Text>
              <VStack justify="start">
                <SegmentedControl v-model="finish" label="Finish">
                  <SegmentedControlItem
                    v-for="f in FINISHES"
                    :key="f.value"
                    :value="f.value"
                    :label="f.label"
                  />
                </SegmentedControl>
              </VStack>
            </VStack>
            <VStack :gap="2">
              <Text type="label">
                Quantity
              </Text>
              <HStack :gap="1" :align="'center'">
                <Button
                  label="Decrease quantity"
                  variant="ghost"
                  :is-disabled="(quantity ?? 1) <= 1"
                  is-icon-only
                  :click-action="decrement"
                >
                  <template #icon>
                    <MinusIcon />
                  </template>
                </Button>
                <Center :width="100">
                  <NumberInput
                    v-model="quantity"
                    label="Quantity"
                    is-label-hidden
                    :min="1"
                    :max="10"
                    is-integer-only
                  />
                </Center>
                <Button
                  label="Increase quantity"
                  variant="ghost"
                  :is-disabled="(quantity ?? 1) >= 10"
                  is-icon-only
                  :click-action="increment"
                >
                  <template #icon>
                    <PlusIcon />
                  </template>
                </Button>
              </HStack>
            </VStack>
            <VStack :gap="2">
              <Button label="Add to Cart" variant="primary" size="lg" />
              <Button label="Buy it now" size="lg" />
            </VStack>
            <CollapsibleGroup type="multiple" :default-value="['composition']">
              <Divider />
              <Collapsible value="composition">
                <template #trigger>
                  <Heading :level="3">
                    Composition
                  </Heading>
                </template>
                <Text type="body">
                  {{ PRODUCT.composition }}
                </Text>
              </Collapsible>
              <Divider />
              <Collapsible value="delivery" :default-is-open="false">
                <template #trigger>
                  <Heading :level="3">
                    Delivery &amp; Returns
                  </Heading>
                </template>
                <Text type="body">
                  {{ PRODUCT.deliveryReturns }}
                </Text>
              </Collapsible>
              <Divider />
              <Collapsible value="dimensions" :default-is-open="false">
                <template #trigger>
                  <Heading :level="3">
                    Dimensions
                  </Heading>
                </template>
                <Text type="body">
                  {{ PRODUCT.dimensions }}
                </Text>
              </Collapsible>
              <Divider />
            </CollapsibleGroup>
          </VStack>
        </VStack>
      </Grid>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.sticky-info {
  position: sticky;
  top: var(--astryx-spacing-8);
  align-self: start;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--astryx-radius-container);
}

.thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.star {
  color: var(--astryx-color-text-secondary);
  font-size: var(--astryx-font-size-sm);
}

.star--filled {
  color: var(--astryx-color-text-primary);
}
</style>
