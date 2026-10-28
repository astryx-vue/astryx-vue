<script setup lang="ts">
import type { CSSProperties } from 'vue'
import {
  AspectRatio,
  Button,
  Card,
  Grid,
  Heading,
  Icon,
  Layout,
  LayoutContent,
  Text,
  VStack,
} from '@astryx-vue/core'

const image: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Going places', description: "Sometimes all it takes is one small thing to turn your whole day around. That's what good design is for.", price: 75.0, image: '/template-assets/illustrative-horizontal-1.png' },
  { id: 2, name: 'Meeting people', description: "Sometimes all it takes is one small thing to turn your whole day around. That's what good design is for.", price: 80.0, image: '/template-assets/illustrative-vertical-1.png' },
  { id: 3, name: 'Seeing things', description: "Sometimes all it takes is one small thing to turn your whole day around. That's what good design is for.", price: 75.0, image: '/template-assets/illustrative-horizontal-3.png' },
  { id: 4, name: 'Sharing ideas', description: "Sometimes all it takes is one small thing to turn your whole day around. That's what good design is for.", price: 75.0, image: '/template-assets/illustrative-horizontal-4.png' },
  { id: 5, name: 'Making memories', description: "Sometimes all it takes is one small thing to turn your whole day around. That's what good design is for.", price: 60.0, image: '/template-assets/illustrative-horizontal-5.png' },
  { id: 6, name: 'Being free', description: "Sometimes all it takes is one small thing to turn your whole day around. That's what good design is for.", price: 80.0, image: '/template-assets/illustrative-horizontal-2.png' },
]

function fmt(n: number) {
  return `$${n.toFixed(2)}`
}
</script>

<template>
  <Layout height="fill" :content-width="1200">
    <LayoutContent :padding="6">
      <VStack :gap="6">
        <Grid :columns="{ minWidth: 280 }" :gap="4" align="start">
          <Heading :level="1">
            Make every day a little more delightful, one small detail at a time.
          </Heading>
          <VStack :gap="3" hAlign="start">
            <Text type="body">
              We believe the smallest details are the ones that matter most. A little color, a thoughtful touch, a moment that catches your eye and makes you pause; that's what turns an ordinary day into something worth remembering.
            </Text>
            <Button label="Get started" variant="primary">
              <template #end>
                <Icon icon="i-heroicons-arrow-right" color="inherit" />
              </template>
            </Button>
          </VStack>
        </Grid>
        <Grid :columns="{ minWidth: 300 }" :gap="6">
          <VStack v-for="product in PRODUCTS" :key="product.id" :gap="3">
            <Card :padding="0">
              <AspectRatio :ratio="1">
                <img :src="product.image" :alt="product.name" :style="image">
              </AspectRatio>
            </Card>
            <VStack :gap="1">
              <Heading :level="2">
                {{ product.name }}
              </Heading>
              <Text type="body" color="secondary" :max-lines="2">
                {{ product.description }}
              </Text>
              <Text type="large" weight="bold">
                {{ fmt(product.price) }}
              </Text>
            </VStack>
          </VStack>
        </Grid>
      </VStack>
    </LayoutContent>
  </Layout>
</template>
