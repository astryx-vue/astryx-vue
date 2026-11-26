<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useClickableContainer } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Link } from '@astryx-vue/core/Link'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const PROJECT_HREF = '#project-design-tokens'

const containerRef = ref<HTMLElement | null>(null)
const projectLinkRef = ref<HTMLElement | null>(null)
const openCount = ref(0)
const isStarred = ref(false)

const { onClick, onMouseUp } = useClickableContainer({
  containerRef,
  interactiveRef: projectLinkRef,
  href: PROJECT_HREF,
})

function elementOf(el: Element | ComponentPublicInstance | null): HTMLElement | null {
  const node = el != null && '$el' in el ? el.$el : el
  return node instanceof HTMLElement ? node : null
}
</script>

<template>
  <VStack :gap="3">
    <Card
      :ref="el => { containerRef = elementOf(el) }"
      :width="360"
      :padding="4"
      @click="onClick"
      @mouseup="onMouseUp"
    >
      <VStack :gap="2">
        <HStack align="center" :gap="2" justify="between">
          <Heading :level="4">
            <Link
              :ref="el => { projectLinkRef = elementOf(el) }"
              :href="PROJECT_HREF"
              type="inherit"
              @click="openCount++"
            >
              Design tokens
            </Link>
          </Heading>
          <Button :label="isStarred ? 'Starred' : 'Star'" variant="secondary" @click="isStarred = !isStarred" />
        </HStack>
        <Text type="body" color="secondary">
          Color, spacing and type tokens shared by every product surface.
        </Text>
        <Text type="supporting" color="secondary">
          Owned by <Link href="#team-design-systems" type="inherit">
            Design Systems
          </Link>
        </Text>
      </VStack>
    </Card>
    <Text type="supporting">
      Project opened {{ openCount }} {{ openCount === 1 ? 'time' : 'times' }}
    </Text>
  </VStack>
</template>
