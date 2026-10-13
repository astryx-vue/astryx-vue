<script setup lang="ts">
import type { CSSProperties } from 'vue'
import {
  AspectRatio,
  Button,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  Section,
  Text,
  VStack,
} from '@astryx-vue/core'

const IMAGE_URL = '/template-assets/light-scene-horizontal-1.png'

const heroImage: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}
const heroFrame: CSSProperties = {
  maxWidth: '1200px',
  marginInline: 'auto',
  borderRadius: 'var(--radius-page)',
}
</script>

<template>
  <Layout>
    <template #default>
      <LayoutContent :padding="6">
        <VStack :gap="10">
          <VStack :gap="6" justify="center">
            <VStack :gap="3" justify="center">
              <Heading :level="1" type="display-2" justify="center" text-wrap="balance">
                Little joys, everywhere you go
              </Heading>
              <Text type="body" color="secondary" justify="center" text-wrap="balance">
                Sometimes all it takes is one small thing to turn your whole
                day around.
              </Text>
            </VStack>
            <HStack :gap="3">
              <Button
                label="Get started"
                variant="primary"
              >
                <template #end-content>
                  <Icon icon="i-heroicons-arrow-right-solid" size="sm" color="inherit" />
                </template>
              </Button>
              <Button label="Learn more" variant="secondary" />
            </HStack>
          </VStack>
          <Section variant="transparent" :padding="0">
            <AspectRatio :ratio="16 / 9" :style="heroFrame">
              <img
                :style="heroImage"
                :src="IMAGE_URL"
                alt="A bright, colorful lifestyle scene"
              >
            </AspectRatio>
          </Section>
        </VStack>
      </LayoutContent>
    </template>
  </Layout>
</template>
