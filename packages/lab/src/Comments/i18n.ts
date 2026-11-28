import type { CommentsMessages } from '@astryx-vue/core'
import type { CommentReactionOption } from './types.js'

type ReactionNameField = 'reactionLike' | 'reactionLove' | 'reactionLaugh' | 'reactionWow' | 'reactionSad' | 'reactionCelebrate'

/* Comments message fields for the names of DEFAULT_COMMENT_REACTIONS, by reaction key. */
const DEFAULT_REACTION_NAME_FIELDS: Readonly<Record<string, ReactionNameField>> = {
  like: 'reactionLike',
  love: 'reactionLove',
  laugh: 'reactionLaugh',
  wow: 'reactionWow',
  sad: 'reactionSad',
  celebrate: 'reactionCelebrate',
}

/**
 * A reaction's human-readable name: the host's `description`, else the
 * localized name of a default reaction, else its glyph.
 */
export function reactionDescription(
  messages: CommentsMessages,
  reaction: Pick<CommentReactionOption, 'key' | 'label' | 'description'>,
): string {
  if (reaction.description != null && reaction.description !== '')
    return reaction.description
  const field = DEFAULT_REACTION_NAME_FIELDS[reaction.key]
  return field != null ? messages[field] : reaction.label
}
