import type { AstryxLocale } from '../types.js'
import { formatIcu } from '../icu.js'

/** 评论。评论组件还没落地，键先接到文案树上，调用方可以用 useTranslator。字段名对应 `@astryx.comments.*` 的最后一段。 */
export interface CommentsMessages {
  actionsLabel: (name: string) => string
  addReaction: string
  agentBadge: string
  agentLogo: (name: string) => string
  chooseReaction: string
  commentsLabel: (label: string) => string
  copyLink: string
  currentVersion: string
  delete: string
  deleteDescription: (name: string) => string
  deleteFailed: string
  deleteFailedRetry: string
  deleteTitle: string
  edit: string
  editFailed: string
  editPlaceholder: string
  edited: string
  editingContext: string
  emptyDescription: string
  emptyReadOnlyDescription: string
  emptyTitle: string
  hideReplies: string
  historyEmptyDescription: string
  historyEmptyTitle: string
  historyFailed: string
  historyLoadFailed: string
  historyLoading: string
  historySubtitle: (name: string) => string
  historyTitle: string
  label: string
  linkCopied: string
  loadFailed: string
  loadOlder: string
  loading: string
  olderFailed: string
  otherReactors: (count: number) => string
  outdated: string
  postFailed: string
  reactionCelebrate: string
  reactionCount: (reaction: string, count: number) => string
  reactionFailed: string
  reactionLaugh: string
  reactionLike: string
  reactionLove: string
  reactionSad: string
  reactionWow: string
  reopen: string
  reopenFailed: string
  reply: string
  replyFailed: string
  replyPlaceholder: (name: string) => string
  replyingContext: (name: string) => string
  resolve: string
  resolveFailed: string
  resolved: string
  resolvedBy: (name: string) => string
  retry: string
  retryFailed: string
  sendFailed: string
  threadLabel: (name: string) => string
  unread: string
  unsavedDraft: string
  versionAuthor: (name: string) => string
  viewHistory: string
  viewReplies: (count: number) => string
  /** 回应组的默认无障碍名。原版写死，目录里没有对应键。 */
  reactionsLabel: string
  /** 没有 label 时，回应胶囊的无障碍名。原版按条数区分 reaction / reactions。 */
  reactionWith: (count: number, emoji: string) => string
}

function fill(template: string, locale: 'en' | 'zh-CN', values: Record<string, string | number>): string {
  return formatIcu(template, values, locale).replace(/[ \t]{2,}/g, ' ').trim()
}

export const commentsMessages: Record<AstryxLocale, CommentsMessages> = {
  'en': {
    actionsLabel: name => fill('Actions for {name}\'s comment', 'en', { name }),
    addReaction: 'Add reaction',
    agentBadge: 'Agent',
    agentLogo: name => fill('{name} logo', 'en', { name }),
    chooseReaction: 'Choose a reaction',
    commentsLabel: label => fill('Threads in {label}', 'en', { label }),
    copyLink: 'Copy comment link',
    currentVersion: 'Current version',
    delete: 'Delete',
    deleteDescription: name => fill('Delete {name}\'s comment? This action cannot be undone.', 'en', { name }),
    deleteFailed: 'This comment couldn\'t be deleted.',
    deleteFailedRetry: 'This comment couldn\'t be deleted. Try again.',
    deleteTitle: 'Delete comment?',
    edit: 'Edit',
    editFailed: 'Your edit couldn\'t be saved.',
    editPlaceholder: 'Edit comment',
    edited: 'Edited',
    editingContext: 'Editing comment',
    emptyDescription: 'Start the discussion with a comment.',
    emptyReadOnlyDescription: 'There is no discussion on this item.',
    emptyTitle: 'No comments yet',
    hideReplies: 'Hide replies',
    historyEmptyDescription: 'This comment has no earlier versions.',
    historyEmptyTitle: 'No edit history',
    historyFailed: 'Edit history couldn\'t load',
    historyLoadFailed: 'The comment\'s edit history couldn\'t be loaded. Try again.',
    historyLoading: 'Loading edit history',
    historySubtitle: name => fill('Comment by {name}', 'en', { name }),
    historyTitle: 'Edit history',
    label: 'Comments',
    linkCopied: 'Comment link copied',
    loadFailed: 'Comments couldn\'t load',
    loadOlder: 'Load earlier comments',
    loading: 'Loading comments',
    olderFailed: 'Earlier comments couldn\'t load',
    otherReactors: count => fill('{count, plural, one {# other} other {# others}}', 'en', { count }),
    outdated: 'Outdated',
    postFailed: 'Your comment couldn\'t be posted.',
    reactionCelebrate: 'Celebrate',
    reactionCount: (reaction, count) => fill('{reaction}: {count, number}', 'en', { reaction, count }),
    reactionFailed: 'Your reaction couldn\'t be saved.',
    reactionLaugh: 'Haha',
    reactionLike: 'Like',
    reactionLove: 'Love',
    reactionSad: 'Sad',
    reactionWow: 'Wow',
    reopen: 'Reopen',
    reopenFailed: 'This thread couldn\'t be reopened.',
    reply: 'Reply',
    replyFailed: 'Your reply couldn\'t be posted.',
    replyPlaceholder: name => fill('Reply to {name}…', 'en', { name }),
    replyingContext: name => fill('Replying to {name}', 'en', { name }),
    resolve: 'Mark as resolved',
    resolveFailed: 'This thread couldn\'t be resolved.',
    resolved: 'Resolved',
    resolvedBy: name => fill('Resolved by {name}', 'en', { name }),
    retry: 'Retry',
    retryFailed: 'Retrying didn\'t work.',
    sendFailed: 'Couldn\'t send this comment.',
    threadLabel: name => fill('Thread by {name}', 'en', { name }),
    unread: 'New',
    unsavedDraft: 'Unsaved draft. Dismiss again to discard it.',
    versionAuthor: name => fill('by {name}', 'en', { name }),
    viewHistory: 'View edit history',
    viewReplies: count => fill('View {count, plural, one {# reply} other {# replies}}', 'en', { count }),
    reactionsLabel: 'Reactions',
    reactionWith: (count, emoji) => `${count} ${count === 1 ? 'reaction' : 'reactions'} with ${emoji}`,
  },
  'zh-CN': {
    actionsLabel: name => fill('{name} 这条评论的操作', 'zh-CN', { name }),
    addReaction: '添加回应',
    agentBadge: '智能体',
    agentLogo: name => fill('{name} 的标志', 'zh-CN', { name }),
    chooseReaction: '选择回应',
    commentsLabel: label => fill('{label} 中的讨论串', 'zh-CN', { label }),
    copyLink: '复制评论链接',
    currentVersion: '当前版本',
    delete: '删除',
    deleteDescription: name => fill('要删除 {name} 的评论吗？此操作无法撤销。', 'zh-CN', { name }),
    deleteFailed: '这条评论没能删除。',
    deleteFailedRetry: '这条评论没能删除。请再试一次。',
    deleteTitle: '删除评论？',
    edit: '编辑',
    editFailed: '这次编辑没能保存。',
    editPlaceholder: '编辑评论',
    edited: '已编辑',
    editingContext: '正在编辑评论',
    emptyDescription: '写一条评论，开始讨论。',
    emptyReadOnlyDescription: '这项还没有讨论。',
    emptyTitle: '还没有评论',
    hideReplies: '隐藏回复',
    historyEmptyDescription: '这条评论没有更早的版本。',
    historyEmptyTitle: '没有编辑历史',
    historyFailed: '编辑历史没能加载',
    historyLoadFailed: '这条评论的编辑历史没能加载。请再试一次。',
    historyLoading: '正在加载编辑历史',
    historySubtitle: name => fill('{name} 的评论', 'zh-CN', { name }),
    historyTitle: '编辑历史',
    label: '评论',
    linkCopied: '评论链接已复制',
    loadFailed: '评论没能加载',
    loadOlder: '加载更早的评论',
    loading: '正在加载评论',
    olderFailed: '更早的评论没能加载',
    otherReactors: count => fill('{count, plural, other {另外 # 人}}', 'zh-CN', { count }),
    outdated: '已过期',
    postFailed: '这条评论没能发出。',
    reactionCelebrate: '庆祝',
    reactionCount: (reaction, count) => fill('{reaction}：{count, number}', 'zh-CN', { reaction, count }),
    reactionFailed: '这次回应没能保存。',
    reactionLaugh: '哈哈',
    reactionLike: '赞',
    reactionLove: '喜欢',
    reactionSad: '难过',
    reactionWow: '哇',
    reopen: '重新打开',
    reopenFailed: '这个讨论串没能重新打开。',
    reply: '回复',
    replyFailed: '这条回复没能发出。',
    replyPlaceholder: name => fill('回复 {name}…', 'zh-CN', { name }),
    replyingContext: name => fill('正在回复 {name}', 'zh-CN', { name }),
    resolve: '标为已解决',
    resolveFailed: '这个讨论串没能标为已解决。',
    resolved: '已解决',
    resolvedBy: name => fill('由 {name} 标为已解决', 'zh-CN', { name }),
    retry: '重试',
    retryFailed: '重试没有成功。',
    sendFailed: '这条评论没能发出。',
    threadLabel: name => fill('{name} 的讨论串', 'zh-CN', { name }),
    unread: '新',
    unsavedDraft: '草稿还没保存。再关闭一次就会丢掉。',
    versionAuthor: name => fill('由 {name}', 'zh-CN', { name }),
    viewHistory: '查看编辑历史',
    viewReplies: count => fill('查看 {count, plural, other {# 条回复}}', 'zh-CN', { count }),
    reactionsLabel: '回应',
    reactionWith: (count, emoji) => `${count} 次 ${emoji} 回应`,
  },
}
