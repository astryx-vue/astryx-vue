<script setup lang="ts">
import type { DropdownMenuOption } from '@astryx-vue/core'
import type { CommentReactionOption } from './types.js'
import type { AnyComment } from './utils.js'
import {
  Button,
  DropdownMenu,
  HStack,
  Icon,
  IconButton,
  Popover,
  Text,
  Tooltip,
  useClipboard,
  useTranslator,
} from '@astryx-vue/core'
import { computed, nextTick, ref } from 'vue'
import { commentMoreMenuTrigger, visibleCommentAction } from './commentActionLookup.js'
import { reactionDescription } from './i18n.js'
import { CommentIcon } from './icons.js'
import { commentAnchorId, toElement } from './utils.js'

defineOptions({ name: 'AstryxCommentActions' })

const props = defineProps<{
  canCopyLink: boolean
  canReact: boolean
  canReply: boolean
  comment: AnyComment
  isBusy: boolean
  menuItems: readonly DropdownMenuOption[]
  menuLabel: string
  options: readonly CommentReactionOption[]
  resolveAction?: ResolveAction
}>()

const emit = defineEmits<{
  openChange: [isOpen: boolean]
  react: [comment: AnyComment, key: string, option?: CommentReactionOption]
  reply: []
}>()

export interface ResolveAction { kind: 'resolve' | 'reopen', onClick: () => void }

const { t } = useTranslator()
const { copy: copyToClipboard, isCopied: isLinkCopied } = useClipboard()
const isLinkTooltipOpen = ref(false)
const isPickerOpen = ref(false)
const cluster = ref<HTMLElement | null>(null)

function setClusterRef(el: unknown): void {
  cluster.value = toElement(el)
}
const href = computed(() => `#${commentAnchorId(props.comment.id)}`)
const linkLabel = computed(() =>
  isLinkCopied.value ? t('@astryx.comments.linkCopied') : t('@astryx.comments.copyLink'),
)
const isLinkInMenu = computed(() => props.menuItems.length > 0)
const resolveLabel = computed(() => t('@astryx.comments.resolve'))
const reopenLabel = computed(() => t('@astryx.comments.reopen'))
const replyLabel = computed(() => t('@astryx.comments.reply'))
const addReactionLabel = computed(() => t('@astryx.comments.addReaction'))

async function copyCommentLink(): Promise<void> {
  await copyToClipboard(new URL(href.value, window.location.href).href)
}

function changePicker(isOpen: boolean): void {
  isPickerOpen.value = isOpen
  emit('openChange', isOpen)
}

async function pickReaction(option: CommentReactionOption): Promise<void> {
  emit('react', props.comment, option.key, option)
  changePicker(false)
  await nextTick()
  const root = cluster.value
  ;(visibleCommentAction(root, 'react') ?? commentMoreMenuTrigger(root))?.focus()
}

const menuOptions = computed<DropdownMenuOption[]>(() => {
  const copyLinkItem: DropdownMenuOption = {
    id: 'copy-link',
    label: linkLabel.value,
    onClick: () => { void copyCommentLink() },
  }
  return [
    ...(props.canCopyLink && isLinkInMenu.value ? [copyLinkItem] : []),
    ...props.menuItems,
  ]
})

const moreButton = computed(() => ({
  label: props.menuLabel,
  variant: 'ghost' as const,
  size: 'sm' as const,
  isIconOnly: true,
  icon: 'moreHorizontal',
  isDisabled: props.isBusy,
  tooltip: props.menuLabel,
}))
</script>

<template>
  <HStack
    :ref="setClusterRef"
    :gap="0.5"
    align="center"
    width="100%"
    data-comment-actions="header"
  >
    <HStack :gap="0.5" align="center" class="astryx-comment-actions-list" data-comment-actions-list="true">
      <IconButton
        v-if="resolveAction?.kind === 'resolve'"
        :label="resolveLabel"
        :tooltip="resolveLabel"
        variant="ghost"
        size="sm"
        data-comment-action="resolve"
        :is-disabled="isBusy"
        @click="resolveAction.onClick"
      >
        <CommentIcon name="resolve" />
      </IconButton>
      <Button
        v-else-if="resolveAction?.kind === 'reopen'"
        :label="reopenLabel"
        variant="ghost"
        size="sm"
        data-comment-action="reopen"
        :is-disabled="isBusy"
        @click="resolveAction.onClick"
      />
      <Popover
        v-if="canReact"
        :is-open="isPickerOpen"
        placement="above"
        alignment="end"
        :label="t('@astryx.comments.chooseReaction')"
        width="fit-content"
        :has-close-button="false"
        @open-change="changePicker"
      >
        <IconButton
          :label="addReactionLabel"
          :tooltip="isPickerOpen ? undefined : addReactionLabel"
          variant="ghost"
          size="sm"
          data-comment-action="react"
          aria-haspopup="dialog"
          :aria-expanded="isPickerOpen"
          :is-disabled="isBusy"
        >
          <CommentIcon name="addReaction" />
        </IconButton>
        <template v-if="isPickerOpen" #content>
          <HStack :gap="0.5" align="center" data-reaction-picker="true">
            <IconButton
              v-for="option in options"
              :key="option.key"
              :label="reactionDescription(t, option)"
              :tooltip="reactionDescription(t, option)"
              variant="ghost"
              :data-reaction-option="option.key"
              :is-disabled="isBusy"
              @click="pickReaction(option)"
            >
              <Text as="span" type="large">
                {{ option.label }}
              </Text>
            </IconButton>
          </HStack>
        </template>
      </Popover>
      <IconButton
        v-if="canReply"
        :label="replyLabel"
        :tooltip="replyLabel"
        variant="ghost"
        size="sm"
        data-comment-action="reply"
        :is-disabled="isBusy"
        @click="emit('reply')"
      >
        <CommentIcon name="reply" />
      </IconButton>
      <Tooltip
        v-if="canCopyLink && !isLinkInMenu"
        :content="linkLabel"
        :is-open="isLinkCopied || isLinkTooltipOpen"
        @open-change="isLinkTooltipOpen = $event"
      >
        <IconButton
          :label="linkLabel"
          variant="ghost"
          size="sm"
          data-comment-action="link"
          :data-link-copied="isLinkCopied ? 'true' : undefined"
          @click="copyCommentLink"
        >
          <Icon v-if="isLinkCopied" icon="check" color="secondary" />
          <CommentIcon v-else name="copyLink" />
        </IconButton>
      </Tooltip>
    </HStack>
    <slot name="additionalActions" />
    <HStack v-if="menuOptions.length > 0" data-comment-more-menu="true">
      <DropdownMenu
        :items="menuOptions"
        menu-width="calc(var(--astryx-spacing-8, 32px) * 5)"
        alignment="end"
        presentation="adaptive"
        :has-chevron="false"
        :button="moreButton"
        @open-change="emit('openChange', $event)"
      />
    </HStack>
  </HStack>
</template>
