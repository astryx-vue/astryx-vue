<script setup lang="ts">
import { Carousel } from '@astryx-vue/core/Carousel'
import { ChatComposer, ChatComposerDrawer } from '@astryx-vue/core/Chat'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Thumbnail } from '@astryx-vue/core/Thumbnail'
import { Token } from '@astryx-vue/core/Token'
import { ref } from 'vue'

const images = ref([
  { id: '1', src: '/template-assets/illustrative-vertical-1.png', alt: 'River through a valley', label: 'valley.jpg' },
  { id: '2', src: '/template-assets/light-working-vertical-1.png', alt: 'Foggy mountain peak', label: 'mountain.jpg' },
  { id: '3', src: '/template-assets/light-working-vertical-2.png', alt: 'Golden retriever puppy', label: 'puppy.jpg' },
  { id: '4', src: '/template-assets/illustrative-horizontal-1.png', alt: 'Bridge at sunset', label: 'bridge.jpg' },
  { id: '5', src: '/template-assets/light-scene-horizontal-1.png', alt: 'Lakeside at dusk', label: 'lakeside.jpg' },
])

const files = ref(['quarterly-report.pdf', 'budget-forecast.xlsx'])

function removeImage(id: string): void {
  images.value = images.value.filter(item => item.id !== id)
}

function remove(name: string): void {
  files.value = files.value.filter(item => item !== name)
}
</script>

<template>
  <ChatComposer>
    <template #drawer>
      <ChatComposerDrawer>
        <VStack :gap="2" width="100%">
          <Carousel :gap="1">
            <Thumbnail
              v-for="image in images"
              :key="image.id"
              :src="image.src"
              :alt="image.alt"
              :label="image.label"
              @remove="removeImage(image.id)"
            />
          </Carousel>
          <HStack :gap="1" wrap="wrap">
            <Token
              v-for="name in files"
              :key="name"
              removable
              :label="name"
              @remove="remove(name)"
            />
          </HStack>
        </VStack>
      </ChatComposerDrawer>
    </template>
  </ChatComposer>
</template>
