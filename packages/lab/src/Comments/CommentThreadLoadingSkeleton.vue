<script setup lang="ts">
import { Card, HStack, Section, Skeleton, StackItem, useTranslator, VisuallyHidden, VStack } from '@astryx-vue/core'
import { AVATAR_SIZE } from './commentLayout.js'
import '../../styles/comment-thread.css'

defineOptions({ name: 'AstryxCommentThreadLoadingSkeleton' })

defineProps<{
  container: 'section' | 'card'
}>()

const { t } = useTranslator()
</script>

<template>
  <VStack :gap="container === 'card' ? 0 : 2" width="100%" data-comments-loading="threads">
    <VisuallyHidden>{{ t('@astryx.comments.loading') }}</VisuallyHidden>
    <component
      :is="container === 'card' ? Section : Card"
      v-for="index in [0, 1, 2]"
      :key="index"
      v-bind="container === 'card'
        ? { variant: 'transparent', dividers: ['top', 'bottom'], padding: 3, width: '100%', class: 'astryx-thread-section-overlap' }
        : { variant: 'default', elevation: 'none', padding: 3, width: '100%' }"
    >
      <HStack :gap="2" align="start" width="100%">
        <Skeleton :width="AVATAR_SIZE" :height="AVATAR_SIZE" radius="rounded" :index="index * 7" />
        <StackItem size="fill">
          <VStack :gap="1" width="100%">
            <HStack :gap="1" align="center" width="100%">
              <Skeleton :width="index === 0 ? '38%' : '30%'" height="var(--astryx-spacing-4)" :radius="1" :index="index * 7 + 1" />
              <Skeleton width="18%" height="var(--astryx-spacing-3)" :radius="1" :index="index * 7 + 2" />
            </HStack>
            <Skeleton width="96%" height="var(--astryx-spacing-4)" :radius="1" :index="index * 7 + 3" />
            <Skeleton :width="index === 0 ? '82%' : '68%'" height="var(--astryx-spacing-4)" :radius="1" :index="index * 7 + 4" />
            <Skeleton
              v-if="index === 0"
              width="54%"
              height="var(--astryx-spacing-4)"
              :radius="1"
              :index="index * 7 + 5"
            />
            <HStack :gap="1" align="center">
              <Skeleton
                width="calc(var(--astryx-spacing-8) + var(--astryx-spacing-4))"
                height="var(--astryx-spacing-6)"
                :radius="2"
                :index="index * 7 + 5"
              />
              <Skeleton width="var(--astryx-spacing-8)" height="var(--astryx-spacing-6)" :radius="2" :index="index * 7 + 6" />
            </HStack>
          </VStack>
        </StackItem>
      </HStack>
    </component>
  </VStack>
</template>
