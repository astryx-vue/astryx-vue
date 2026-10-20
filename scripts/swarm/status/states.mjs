/**
 * 节点状态表：emoji、中文名、英文简写，以及生命周期里允许的流转。
 * 顺序就是 ROADMAP「状态图例」的顺序。
 */

export const STATES = Object.freeze([
  { key: 'not-started', emoji: '⬜', name: '未开始', aliases: ['todo'] },
  { key: 'ready', emoji: '🔵', name: '可开工', aliases: [] },
  { key: 'implementing', emoji: '🟡', name: '实现中', aliases: ['impl', 'wip'] },
  { key: 'awaiting-verify', emoji: '🟣', name: '待验收', aliases: ['to-verify', 'implemented'] },
  { key: 'verifying', emoji: '🔷', name: '验收中', aliases: ['verify'] },
  { key: 'rework', emoji: '🔴', name: '返工中', aliases: ['rejected'] },
  { key: 'needs-user', emoji: '🟠', name: '待用户决定', aliases: ['user', 'blocked'] },
  { key: 'done', emoji: '✅', name: '已完成', aliases: ['completed'] },
  { key: 'skipped', emoji: '➖', name: '不做', aliases: ['skip', 'wontdo'] },
])

const BY_KEY = new Map(STATES.map(state => [state.key, state]))
const BY_EMOJI = new Map(STATES.map(state => [state.emoji, state]))

/** 去掉 emoji 后面可能跟着的变体选择符 U+FE0F。 */
function bareEmoji(text) {
  return text.replace(/\uFE0F/g, '')
}

export function stateByKey(key) {
  return BY_KEY.get(key)
}

export function stateByEmoji(emoji) {
  return BY_EMOJI.get(bareEmoji(emoji))
}

/**
 * 把用户输入换成状态。接受英文简写（verifying、done）、别名、中文名（验收中）、
 * emoji（🔷）和总表里的写法（🔷 验收中）。认不出来时返回 undefined。
 */
export function resolveState(input) {
  const text = bareEmoji(String(input ?? '').trim())
  const lower = text.toLowerCase()
  return STATES.find(state => state.key === lower
    || state.aliases.includes(lower)
    || state.name === text
    || state.emoji === text
    || `${state.emoji} ${state.name}` === text)
}

/** 依赖算不算「已经没东西可等」：做完了，或者决定不做。 */
export function isResolved(state) {
  return state.key === 'done' || state.key === 'skipped'
}

/** 节点是否已经进入「可开工或之后」，这些状态要求依赖全部结束。 */
export function requiresResolvedDeps(state) {
  return state.key !== 'not-started' && state.key !== 'skipped'
}

/** SWARM.md 生命周期状态图里的边。 */
const TRANSITIONS = new Map([
  ['not-started', ['ready']],
  ['ready', ['implementing']],
  ['implementing', ['awaiting-verify']],
  ['awaiting-verify', ['verifying']],
  ['verifying', ['done', 'rework']],
  ['rework', ['implementing', 'needs-user']],
  ['needs-user', ['implementing', 'skipped']],
  ['done', []],
  ['skipped', []],
])

/**
 * 从 from 改到 to 是否合规。同一状态（只改其它列）总是允许；
 * 还没做完的节点随时可以决定「不做」。
 */
export function isAllowedTransition(from, to) {
  if (from.key === to.key)
    return true
  if (to.key === 'skipped' && !isResolved(from))
    return true
  return TRANSITIONS.get(from.key).includes(to.key)
}

/** 用法说明里列出的状态清单。 */
export function describeStates() {
  return STATES.map(state => `${state.emoji} ${state.name}（${[state.key, ...state.aliases].join(' / ')}）`).join('\n')
}
