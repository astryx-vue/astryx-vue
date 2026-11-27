<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { Button } from '@astryx-vue/core/Button'
import { Outline, useOutlineFromDOM } from '@astryx-vue/core/Outline'
import { ScrollableArea } from '@astryx-vue/core/ScrollableArea'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { computed, ref } from 'vue'

const sections = ref(['Before you start', 'Run the upgrade', 'Check the result'])
const articleBody = ref<HTMLElement | null>(null)
const items = useOutlineFromDOM(articleBody)
const article = ref<ComponentPublicInstance | null>(null)
const scrollContainer = computed(() => (article.value?.$el as HTMLElement | undefined) ?? null)

function slug(title: string): string {
  return `dom-${title.toLowerCase().replace(/\s+/g, '-')}`
}

function addSection(): void {
  sections.value = [...sections.value, `New section ${sections.value.length - 2}`]
}
</script>

<template>
  <HStack :gap="6" align="start" width="100%">
    <ScrollableArea ref="article" label="Article" :height="320" width="100%">
      <article ref="articleBody">
        <section v-for="title in sections" :key="title">
          <h2 :id="slug(title)">
            {{ title }}
          </h2>
          <p>Each heading has an id, so the outline can link to it. A heading without an id is left out.</p>
          <p>The outline follows the article as headings are added, renamed, or removed.</p>
        </section>
      </article>
    </ScrollableArea>
    <VStack :gap="3" align="start" :width="220">
      <!-- A non-zero offset moves only the article. With 0, a click also moves the page around it. -->
      <Outline :items="items" :scroll-container="scrollContainer" :offset="8" />
      <Button label="Add section" variant="secondary" size="sm" @click="addSection" />
    </VStack>
  </HStack>
</template>
