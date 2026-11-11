<script setup lang="ts">
import type { AvatarSize, IconSize } from '@astryx-vue/core'
import type { CommentPinEmits, CommentPinParticipant, CommentPinProps, CommentPinSize } from './types.js'
import {
  Avatar,
  AvatarGroup,
  AvatarGroupOverflow,
  Icon,
  StatusDot,
  Tooltip,
  useDevWarning,
  usePressFeedback,
} from '@astryx-vue/core'
import { computed, ref, useAttrs } from 'vue'
import { toElement } from '../Comments/utils.js'
import '../../styles/comment-pin.css'

defineOptions({ name: 'AstryxCommentPin', inheritAttrs: false })

const props = withDefaults(defineProps<CommentPinProps>(), {
  size: 'sm',
  threadCount: 1,
  unreadCount: 0,
  isSelected: false,
  isDimmed: false,
  isResolved: false,
  isDisabled: false,
})
const emit = defineEmits<CommentPinEmits>()
const attrs = useAttrs()

const rootRef = ref<HTMLElement | null>(null)
const { pressableProps } = usePressFeedback()

const buttonBind = computed(() => {
  const { class: attrClass, ...restAttrs } = attrs as Record<string, unknown>
  return {
    ...restAttrs,
    ...pressableProps,
    class: [attrClass, pressableProps.class],
  }
})

function setRootRef(el: unknown): void {
  rootRef.value = toElement(el)
}

const MAX_GROUP_CIRCLES = 3
const AVATAR_SIZE: Record<CommentPinSize, AvatarSize> = {
  sm: 22 as AvatarSize,
  md: 24,
  lg: 28 as AvatarSize,
}
const OVERFLOW_ICON_SIZE: Record<CommentPinSize, IconSize> = {
  sm: 'xsm',
  md: 'xsm',
  lg: 'sm',
}

function takeDistinctParticipants(
  participants: readonly CommentPinParticipant[],
  limit: number,
): CommentPinParticipant[] {
  const result: CommentPinParticipant[] = []
  const seen = new Set<string>()
  for (const participant of participants) {
    if (seen.has(participant.id))
      continue
    seen.add(participant.id)
    result.push(participant)
    if (result.length === limit)
      break
  }
  return result
}

function isValidThreadCount(threadCount: number): boolean {
  return Number.isFinite(threadCount) && Number.isInteger(threadCount) && threadCount >= 1
}

function isValidUnreadCount(unreadCount: number): boolean {
  return Number.isFinite(unreadCount) && Number.isInteger(unreadCount) && unreadCount >= 0
}

const resolvedSize = computed<CommentPinSize>(() =>
  props.size === 'md' || props.size === 'lg' ? props.size : 'sm',
)
const validThreadCount = computed(() => isValidThreadCount(props.threadCount))
const resolvedThreadCount = computed(() => validThreadCount.value ? props.threadCount : 1)
const isGrouped = computed(() => resolvedThreadCount.value > 1)
const validUnreadCount = computed(() => isValidUnreadCount(props.unreadCount))
const resolvedUnreadCount = computed(() =>
  validUnreadCount.value ? Math.min(props.unreadCount, resolvedThreadCount.value) : 0,
)
const hasUnread = computed(() => resolvedUnreadCount.value > 0)
const isVisible = computed(() => !(props.isResolved && !props.isSelected))
const hasTooltip = computed(() => !props.isDisabled && props.label.trim() !== '')

const distinctParticipants = computed(() =>
  takeDistinctParticipants(props.participants, isGrouped.value ? Number.POSITIVE_INFINITY : 1),
)
const hasOverflow = computed(() => isGrouped.value && distinctParticipants.value.length > MAX_GROUP_CIRCLES)
const visibleParticipants = computed(() =>
  hasOverflow.value
    ? distinctParticipants.value.slice(0, MAX_GROUP_CIRCLES - 1)
    : distinctParticipants.value,
)
const overflowCount = computed(() => distinctParticipants.value.length - visibleParticipants.value.length)
const avatarParticipants = computed(() =>
  visibleParticipants.value.length > 0
    ? visibleParticipants.value
    : [{ id: '__anonymous__', name: '', avatarSrc: undefined }],
)
const avatarSize = computed(() => AVATAR_SIZE[resolvedSize.value])

useDevWarning(
  'CommentPin',
  '`participants` should contain at least one participant. Pass the lead participant for a single thread or every distinct participant for a group.',
  () => props.participants.length === 0,
)
useDevWarning(
  'CommentPin',
  '`threadCount` must be a finite positive integer. Invalid values fall back to 1.',
  () => !validThreadCount.value,
)
useDevWarning(
  'CommentPin',
  '`unreadCount` must be a finite non-negative integer no greater than `threadCount`. Invalid values are ignored and larger values are capped.',
  () => !validUnreadCount.value || props.unreadCount > resolvedThreadCount.value,
)
useDevWarning(
  'CommentPin',
  '`label` must be a non-empty accessible action name.',
  () => props.label.trim() === '',
)

function onClick(event: MouseEvent): void {
  if (props.isDisabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}

function onKeyDown(event: KeyboardEvent): void {
  if (props.isDisabled && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    event.stopPropagation()
  }
}

defineExpose({ element: rootRef })
</script>

<template>
  <Tooltip
    v-if="isVisible"
    :content="label"
    placement="above"
    :is-enabled="hasTooltip"
  >
    <button
      v-bind="buttonBind"
      :ref="setRootRef"
      type="button"
      class="astryx-comment-pin"
      :aria-label="label"
      :aria-pressed="isSelected"
      :aria-disabled="isDisabled ? 'true' : undefined"
      :data-size="resolvedSize"
      :data-grouped="isGrouped ? 'grouped' : undefined"
      :data-unread="hasUnread ? 'unread' : undefined"
      :data-selected="isSelected ? 'selected' : undefined"
      :data-dimmed="isDimmed ? 'dimmed' : undefined"
      :data-resolved="isResolved ? 'resolved' : undefined"
      :data-disabled="isDisabled ? 'disabled' : undefined"
      @click="onClick"
      @keydown="onKeyDown"
    >
      <span
        class="astryx-comment-pin__avatar-rail"
        :class="{ 'astryx-comment-pin__avatar-rail--grouped': isGrouped }"
        aria-hidden="true"
      >
        <AvatarGroup v-if="isGrouped" :size="avatarSize">
          <Avatar
            v-for="participant in avatarParticipants"
            :key="participant.id"
            :name="participant.name"
            :src="participant.avatarSrc"
            :tooltip="false"
          />
          <AvatarGroupOverflow
            v-if="overflowCount > 0"
            :count="overflowCount"
            class="astryx-comment-pin__overflow"
          >
            <Icon icon="moreHorizontal" :size="OVERFLOW_ICON_SIZE[resolvedSize]" />
          </AvatarGroupOverflow>
        </AvatarGroup>
        <template v-else>
          <Avatar
            v-for="participant in avatarParticipants"
            :key="participant.id"
            :name="participant.name"
            :src="participant.avatarSrc"
            :size="avatarSize"
            :tooltip="false"
          />
        </template>
      </span>
      <span
        v-if="hasUnread || isGrouped"
        class="astryx-comment-pin__trailing"
        aria-hidden="true"
      >
        <span v-if="isGrouped" class="astryx-comment-pin__count">{{ resolvedThreadCount }}</span>
        <span v-if="hasUnread" class="astryx-comment-pin__unread">
          <StatusDot variant="accent" label="" />
        </span>
      </span>
    </button>
  </Tooltip>
</template>
