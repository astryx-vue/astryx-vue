import type { ChatComposerToken, ChatComposerTokenCustom } from './types.js'

export function isCustomToken(token: ChatComposerToken): token is ChatComposerTokenCustom {
  return 'render' in token && typeof token.render === 'function'
}
