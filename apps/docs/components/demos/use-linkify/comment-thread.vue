<script setup lang="ts">
import type { LinkifyPattern } from '@astryx-vue/core'
import { useLinkify } from '@astryx-vue/core'
import { Link } from '@astryx-vue/core/Link'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const issue: LinkifyPattern = {
  pattern: /#(\d+)/g,
  href: match => `https://tracker.example.com/issues/${match[1]}`,
}
const options = { patterns: [issue] }

const comments = [
  'Repro steps are at https://example.com/repro, mail dana@example.com for the build.',
  'Probably the same root cause as #123 and #456.',
  'No links in this one.',
]
const threads = comments.map(comment => useLinkify(comment, options))
</script>

<template>
  <VStack :gap="2">
    <Text v-for="(segments, index) in threads" :key="index" as="p">
      <template v-for="(segment, at) in segments.value" :key="at">
        <Link v-if="segment.type === 'link'" :href="segment.href" :is-external-link="segment.isExternal">
          {{ segment.text }}
        </Link>
        <template v-else>
          {{ segment.text }}
        </template>
      </template>
    </Text>
  </VStack>
</template>
