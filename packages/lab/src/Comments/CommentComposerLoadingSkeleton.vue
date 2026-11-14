<script setup lang="ts">
import { Card, HStack, Skeleton, VStack } from '@astryx-vue/core'
import '../../styles/comments.css'

defineOptions({ name: 'AstryxCommentComposerLoadingSkeleton' })

defineProps<{
  actionCount: number
}>()
</script>

<template>
  <Card
    variant="default"
    elevation="none"
    :padding="2"
    width="100%"
    class="astryx-comments-loading-composer"
    data-comments-loading="composer"
  >
    <VStack :gap="2" width="100%">
      <Skeleton width="42%" height="var(--astryx-spacing-4)" :radius="1" :index="22" />
      <HStack :gap="1" align="center" justify="between" width="100%">
        <HStack :gap="0.5" align="center">
          <Skeleton
            v-for="offset in actionCount"
            :key="offset"
            width="var(--astryx-spacing-8)"
            height="var(--astryx-spacing-8)"
            :radius="2"
            :index="22 + offset"
          />
        </HStack>
        <Skeleton
          width="var(--astryx-spacing-8)"
          height="var(--astryx-spacing-8)"
          :radius="2"
          :index="23 + actionCount"
        />
      </HStack>
    </VStack>
  </Card>
</template>
