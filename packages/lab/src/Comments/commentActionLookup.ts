export type CommentActionId = 'resolve' | 'reopen' | 'react' | 'reply' | 'link'

export function visibleCommentAction(
  root: HTMLElement | null,
  action: CommentActionId,
): HTMLElement | null {
  return root?.querySelector<HTMLElement>(
    `[data-comment-actions-list] [data-comment-action="${action}"]`,
  ) ?? null
}

export function commentMoreMenuTrigger(root: HTMLElement | null): HTMLElement | null {
  return root?.querySelector<HTMLElement>('[data-comment-more-menu] button') ?? null
}
