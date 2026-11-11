<script setup lang="ts">
import type { AnyComment } from './utils.js'
import { HStack, Text, ToggleButton, Tooltip, useAstryxLocale, useTranslator, VStack } from '@astryx-vue/core'
import { reactionDescription } from './i18n.js'

defineOptions({ name: 'AstryxCommentReactionSummary' })

const props = defineProps<{
  canReact: boolean
  comment: AnyComment
  isBusy: boolean
}>()

const emit = defineEmits<{
  react: [comment: AnyComment, key: string]
}>()

const { t } = useTranslator()
const locale = useAstryxLocale()

function people(reaction: NonNullable<AnyComment['reactions']>[number]): string {
  const names = (reaction.actors ?? []).map(actor => actor.name)
  const others = reaction.count - names.length
  if (names.length === 0)
    return reactionDescription(t, reaction)
  const items = others > 0
    ? [...names, t('@astryx.comments.otherReactors', { count: others })]
    : names
  return new Intl.ListFormat(locale.value, { type: 'conjunction' }).format(items)
}

function onToggle(reactionKey: string): void {
  if (!props.isBusy)
    emit('react', props.comment, reactionKey)
}
</script>

<template>
  <HStack v-if="(comment.reactions ?? []).length > 0" :gap="1" align="center" data-comment-reactions="true">
    <Tooltip v-for="reaction in comment.reactions" :key="reaction.key">
      <template #content>
        <VStack :gap="0.5" align="start">
          <HStack :gap="1" align="center">
            <Text as="span" type="body" color="inherit">
              {{ reaction.label }}
            </Text>
            <Text as="span" type="body" color="inherit">
              {{ reaction.count }}
            </Text>
          </HStack>
          <Text type="supporting" color="inherit">
            {{ people(reaction) }}
          </Text>
        </VStack>
      </template>
      <ToggleButton
        :label="t('@astryx.comments.reactionCount', { reaction: reactionDescription(t, reaction), count: reaction.count })"
        size="sm"
        :is-pressed="reaction.reactedByViewer === true"
        :is-disabled="!canReact"
        class="astryx-comment-reaction-toggle"
        :data-comment-reaction="reaction.key"
        @update:is-pressed="onToggle(reaction.key)"
      >
        <HStack :gap="1" align="center">
          <Text as="span" type="body" color="primary" weight="normal">
            {{ reaction.label }}
          </Text>
          <Text as="span" type="body" color="primary" weight="normal">
            {{ reaction.count }}
          </Text>
        </HStack>
      </ToggleButton>
    </Tooltip>
  </HStack>
</template>
