import type { ChatComposerTrigger, ChatComposerTriggerItem } from '@astryx-vue/core'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { CommentAgentCommand } from './types.js'
import { Avatar, createStaticSource, HStack, Text, useTranslator, VStack } from '@astryx-vue/core'
import { computed, h, toValue } from 'vue'
import { agentToken } from './agentToken.js'

function renderAgentCommandItem(item: ChatComposerTriggerItem): ReturnType<typeof h> {
  const agent = item.auxiliaryData as CommentAgentCommand
  return h(HStack, { gap: 2, align: 'center' }, {
    default: () => [
      h(Avatar, {
        name: agent.name,
        src: agent.logoUrl,
        size: 'sm',
        shape: 'rounded',
        tooltip: false,
      }),
      h(VStack, { gap: 0.5 }, {
        default: () => [
          h(Text, { weight: 'semibold' }, { default: () => `/${agent.command} <prompt>` }),
          h(Text, { type: 'supporting', color: 'secondary' }, {
            default: () => `${agent.name} · ${agent.description}`,
          }),
        ],
      }),
    ],
  })
}

/** The `/` menu of the agents a comment can address, or null for none. */
export function useAgentCommandTrigger(
  agents: MaybeRefOrGetter<readonly CommentAgentCommand[]>,
): ComputedRef<ChatComposerTrigger | null> {
  const { t } = useTranslator()
  return computed(() => {
    const list = toValue(agents)
    if (list.length === 0)
      return null
    const items: Array<ChatComposerTriggerItem & { auxiliaryData: CommentAgentCommand }> = list.map(agent => ({
      id: agent.command,
      label: `/${agent.command}`,
      auxiliaryData: agent,
    }))
    return {
      character: '/',
      searchSource: createStaticSource(items, {
        keywords: item => [item.auxiliaryData.command, item.auxiliaryData.name],
      }),
      renderItem: renderAgentCommandItem,
      onSelect: item => agentToken((item as { auxiliaryData: CommentAgentCommand }).auxiliaryData),
      emptySearchText: t('@astryx.commentComposer.noAgents'),
      menuLabel: t('@astryx.commentComposer.agents'),
    }
  })
}
