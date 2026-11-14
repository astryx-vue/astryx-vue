import type { ChatComposerToken } from '@astryx-vue/core'
import type { CommentAgentCommand } from './types.js'
import { Avatar } from '@astryx-vue/core'
import { h } from 'vue'

/** An agent's chip: what the composer's `/` menu inserts. */
export function agentToken(agent: CommentAgentCommand): ChatComposerToken {
  return {
    value: `/${agent.command}`,
    render: () => h(Avatar, {
      name: agent.name,
      src: agent.logoUrl,
      size: 'xsm',
      shape: 'rounded',
      tooltip: false,
    }),
  }
}
