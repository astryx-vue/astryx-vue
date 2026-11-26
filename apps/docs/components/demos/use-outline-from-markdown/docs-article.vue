<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { Button } from '@astryx-vue/core/Button'
import { Markdown } from '@astryx-vue/core/Markdown'
import { Outline, useOutlineFromMarkdown } from '@astryx-vue/core/Outline'
import { ScrollableArea } from '@astryx-vue/core/ScrollableArea'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { computed, ref } from 'vue'

const ARTICLE = `## Before you start

Check that your project builds on the current release. Commit your work, so
that you can compare the result of the upgrade.

## Run the upgrade

Update the packages, then rebuild the project. The upgrade changes no source
files.

### Update the packages

Install the new version of every package at the same time. Mixed versions fail
the build.

### Rebuild the project

Delete the build output first. A stale cache can hide a real error.

## Check the result

Open the pages that you use most, and compare them with the earlier build.
`

const NEW_SECTION = `
## New section

The button added this heading to the Markdown string.
`

const markdown = ref(ARTICLE)
const items = useOutlineFromMarkdown(markdown)
const article = ref<ComponentPublicInstance | null>(null)
const scrollContainer = computed(() => (article.value?.$el as HTMLElement | undefined) ?? null)

function addSection(): void {
  markdown.value += NEW_SECTION
}
</script>

<template>
  <HStack :gap="6" align="start" width="100%">
    <ScrollableArea ref="article" label="Article" :height="320" width="100%">
      <Markdown :content="markdown" />
    </ScrollableArea>
    <VStack :gap="3" align="start" :width="220">
      <!-- A non-zero offset moves only the article. With 0, a click also moves the page around it. -->
      <Outline :items="items" :scroll-container="scrollContainer" :offset="8" />
      <Button label="Add section" variant="secondary" size="sm" @click="addSection" />
    </VStack>
  </HStack>
</template>
