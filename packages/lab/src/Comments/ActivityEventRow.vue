<script setup lang="ts">
import type { CommentActivityEvent } from './types.js'
import { Center, HStack, Item, Link, Text, Timestamp, VStack } from '@astryx-vue/core'
import { computed } from 'vue'
import AuthorName from './AuthorName.vue'
import { CommentIcon } from './icons.js'
import { eventAnchorId } from './utils.js'
import '../../styles/comments.css'

defineOptions({ name: 'AstryxCommentActivityEventRow' })

const props = defineProps<{
  event: CommentActivityEvent
  renderEvent?: (event: CommentActivityEvent) => import('vue').VNode
}>()

const anchorId = computed(() => eventAnchorId(props.event.id))
const href = computed(() => props.event.href ?? `#${anchorId.value}`)
const hasDescription = computed(() => props.event.actor != null || props.event.description != null)
</script>

<template>
  <VStack v-if="renderEvent != null" :id="anchorId" width="100%" :data-comments-event-id="event.id">
    <component :is="() => renderEvent!(event)" />
  </VStack>
  <Item
    v-else
    :id="anchorId"
    :data-comments-event-id="event.id"
    density="compact"
    align="start"
    class="astryx-comments-event"
    :label="event.label"
  >
    <template #startContent>
      <Center class="astryx-comments-event-avatar" aria-hidden="true">
        <CommentIcon name="event" size="md" />
      </Center>
    </template>
    <template v-if="hasDescription" #description>
      <HStack :gap="1" align="center" wrap="wrap">
        <AuthorName v-if="event.actor != null" :author="event.actor" />
        <Text v-if="event.description != null" type="supporting" color="secondary">
          {{ event.description }}
        </Text>
      </HStack>
    </template>
    <template #endContent>
      <Link :href="href" type="supporting" color="secondary">
        <Timestamp
          :value="event.createdAt"
          format="relative_short"
          type="supporting"
          color="inherit"
          :is-live="true"
        />
      </Link>
    </template>
  </Item>
</template>
