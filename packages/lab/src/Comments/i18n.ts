import type { Translator } from '@astryx-vue/core'
import type { CommentReactionOption } from './types.js'

/* Catalog keys for the names of DEFAULT_COMMENT_REACTIONS, by reaction key. */
const DEFAULT_REACTION_NAME_KEYS: Readonly<Record<string, string>> = {
  like: '@astryx.comments.reactionLike',
  love: '@astryx.comments.reactionLove',
  laugh: '@astryx.comments.reactionLaugh',
  wow: '@astryx.comments.reactionWow',
  sad: '@astryx.comments.reactionSad',
  celebrate: '@astryx.comments.reactionCelebrate',
}

/**
 * A reaction's human-readable name: the host's `description`, else the
 * localized name of a default reaction, else its glyph.
 */
export function reactionDescription(
  t: Translator,
  reaction: Pick<CommentReactionOption, 'key' | 'label' | 'description'>,
): string {
  if (reaction.description != null && reaction.description !== '')
    return reaction.description
  const key = DEFAULT_REACTION_NAME_KEYS[reaction.key]
  return key != null ? t(key) : reaction.label
}
