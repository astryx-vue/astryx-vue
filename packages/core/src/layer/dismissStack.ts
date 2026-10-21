import { isImeKeyEvent } from '../composables/internal/ime.js'

/**
 * 全页面共用的「浮层关闭栈」。
 *
 * 以前每一个浮层各自在 document 上挂一套 pointerdown 和 keydown 监听，
 * 结果按一次 Escape 会把所有开着的层一起关掉：Dialog 里开一个下拉菜单，
 * 一次 Escape 连 Dialog 也关了。这里把这件事收成一处：
 *
 * - document 上只有一套监听，栈里有层才挂上去，栈空了就摘掉。
 * - Escape 永远只看「最上面那一层」：`'close'` 关掉它，`'block'` 吃掉按键但不关，
 *   `'ignore'` 留给这一层自己处理。不会把按键交给下面那层。
 * - 点在某一层里面（含它的触发器）就只关掉它上面那些层，这一层自己不动；
 *   点在所有层外面时只关最上面那一层。
 *
 * 「哪一层在上面」用三条线索判断，和上游一致：嵌套深度（组件树里更深的在上，
 * Teleport 切不断）、容器互相包含（同一深度时，DOM 上包着别人的在上），
 * 以及每个身份只认一次的序号（同一层重新登记时不许插队）。
 */

/**
 * Escape 到达某一层时的三种处理。
 *
 * 按键永远只打最上面那一层，没有「让给下面」这一档。
 */
export type DismissEscape = 'close' | 'block' | 'ignore'

export interface DismissStackEntry {
  /**
   * 这一层的身份。选项变化时重新登记要沿用同一个身份，
   * 这样它的排位保持不变，不会突然跑到后开的层上面。
   */
  token: object
  /**
   * 嵌套深度，从组件树读，不看 DOM。不传当作 0。
   * 数字更大的在上面。同一提示再打开仍用旧排位号时，靠它压过外面那一层。
   */
  depth?: number
  /** 这一层的容器元素，按下时读。没给就只按触发器和顺序判断。 */
  getContainer?: () => HTMLElement | null
  /** 这一层的触发器元素。点在它上面不算「点外面」，交给触发器自己开关。 */
  getTrigger?: () => HTMLElement | null
  /**
   * 这一层此刻是否真的在屏幕上，按下时读。
   * 不传表示「登记了就是在」，适用于打开时才登记的层。
   */
  isPresent?: () => boolean
  /** 点在这一层外面时，是否关闭这一层。 */
  dismissOnPointerOutside: boolean
  /**
   * Escape 到达这一层时怎么处理。
   * `'close'` 关掉这一层，`'block'` 吃掉按键但不关，
   * `'ignore'` 什么都不做，留给自己会 `preventDefault` 的输入组件。
   */
  dismissOnEscape: DismissEscape
  /** Escape 关闭这一层时调用。不传就用 `onDismiss`，菜单逐层退栈时用得上。 */
  onEscape?: () => void
  /** 关闭这一层。 */
  onDismiss: () => void
}

interface StackEntry extends DismissStackEntry {
  /** 嵌套深度。登记时落成数字，比较时不再处理「没传」。 */
  depth: number
  /** 登记顺序。同一身份沿用第一次拿到的号，重新登记不会插队。 */
  seq: number
  /** 登记那一刻的按压编号。用来忽略「打开这一次按压自己」。 */
  bornPress: number
}

const entries: StackEntry[] = []
let seqByToken = new WeakMap<object, number>()
let nextSeq = 0
let isListening = false
/**
 * 按压编号。每收到一次 pointerdown 加一。
 * 在一次按压里才登记进来的层（触发器按下就打开的那种）不能被这次按压自己关掉，
 * 记下编号就能认出来。
 */
let pressSerial = 0

function seqFor(token: object): number {
  const existing = seqByToken.get(token)
  if (existing !== undefined)
    return existing
  const seq = nextSeq++
  seqByToken.set(token, seq)
  return seq
}

function isPresent(entry: StackEntry): boolean {
  return entry.isPresent?.() ?? true
}

/**
 * 比较两层谁在上面：正数表示 `a` 在上面，负数表示在下面。
 *
 * 先比嵌套深度，再比 DOM 包含，最后比排位号。这是一个偏序，只能两两比较求最大值，
 * 不能排序：容器包含关系只在有包含关系的那一对之间有定义。
 */
function compareEntries(a: StackEntry, b: StackEntry): number {
  if (a.depth !== b.depth)
    return a.depth - b.depth
  const aEl = a.getContainer?.() ?? null
  const bEl = b.getContainer?.() ?? null
  if (aEl != null && bEl != null && aEl !== bEl) {
    if (bEl.contains(aEl))
      return 1
    if (aEl.contains(bEl))
      return -1
  }
  return a.seq - b.seq
}

/** 屏幕上现存的层，最上面那层在前。 */
function presentEntriesTopFirst(): StackEntry[] {
  const present = entries.filter(isPresent)
  const ordered: StackEntry[] = []
  for (const entry of present) {
    let insertAt = ordered.length
    for (let i = 0; i < ordered.length; i++) {
      if (compareEntries(entry, ordered[i]) > 0) {
        insertAt = i
        break
      }
    }
    ordered.splice(insertAt, 0, entry)
  }
  return ordered
}

function topPresentEntry(): StackEntry | null {
  return presentEntriesTopFirst()[0] ?? null
}

/** `token` 是不是此刻最上面那一层。 */
export function isTopLayer(token: object): boolean {
  return topPresentEntry()?.token === token
}

/**
 * 关掉一次按压该关掉的层。
 *
 * 从最上面往下找，点在某一层里面就只关它上面的层；点在所有层外面就只关最上面那一层。
 * 点在栈顶自己的触发器上时什么都不关，那一下是触发器的开关动作。
 */
function handlePointerDown(event: PointerEvent): void {
  pressSerial += 1
  const serial = pressSerial
  const target = event.target
  if (!(target instanceof Node))
    return

  const ordered = presentEntriesTopFirst()
    // 这次按压里才登记进来的层，不能被这次按压关掉。
    .filter(entry => entry.bornPress !== serial)
  const top = ordered[0]
  if (top == null)
    return

  const topTrigger = top.getTrigger?.() ?? null
  if (topTrigger != null && topTrigger.contains(target))
    return

  for (let i = 0; i < ordered.length; i++) {
    const container = ordered[i].getContainer?.() ?? null
    if (container == null || !container.contains(target))
      continue
    // 点在 i 这一层里面：它上面的层都该关，它自己不动。
    for (let j = 0; j < i; j++) {
      const above = ordered[j]
      if (above.dismissOnPointerOutside)
        above.onDismiss()
    }
    return
  }

  if (top.dismissOnPointerOutside)
    top.onDismiss()
}

/**
 * 把一次 Escape 按键交给栈。
 *
 * 输入法拼字中的 Escape 是取消拼字，不是关层：什么都不关，但仍然吃掉这次按键。
 * 不吃掉的话浏览器会自己发起一次关闭请求，同一按键照样把层关掉。
 */
function handleKeyDown(event: KeyboardEvent): void {
  if (event.key !== 'Escape')
    return

  const top = topPresentEntry()
  if (top == null)
    return

  if (isImeKeyEvent(event)) {
    event.preventDefault()
    return
  }

  // 层里已经有内容处理过这次按键了（它调了 preventDefault），让给它。
  if (event.defaultPrevented)
    return

  // 只看最上面那一层。不在屏幕上的层已经被 topPresentEntry 跳过。
  if (top.dismissOnEscape === 'ignore')
    return

  // 吃掉按键，免得浏览器自己再去关一层（原生 dialog 的 cancel 事件）。
  event.preventDefault()
  if (top.dismissOnEscape === 'block')
    return

  if (top.onEscape != null)
    top.onEscape()
  else
    top.onDismiss()
}

function startListening(): void {
  if (isListening || typeof document === 'undefined')
    return
  isListening = true
  document.addEventListener('pointerdown', handlePointerDown, true)
  document.addEventListener('keydown', handleKeyDown)
}

function stopListening(): void {
  if (!isListening || typeof document === 'undefined')
    return
  isListening = false
  document.removeEventListener('pointerdown', handlePointerDown, true)
  document.removeEventListener('keydown', handleKeyDown)
}

/**
 * 把一层登记进栈，返回「把这一层摘下来」的函数。
 * 调用方负责在关闭或卸载时调用它。
 */
export function pushLayer(entry: DismissStackEntry): () => void {
  const full: StackEntry = {
    ...entry,
    depth: entry.depth ?? 0,
    seq: seqFor(entry.token),
    bornPress: pressSerial,
  }
  entries.push(full)
  startListening()

  return () => {
    const index = entries.indexOf(full)
    if (index !== -1)
      entries.splice(index, 1)
    if (entries.length === 0)
      stopListening()
  }
}

/** 只给测试用：清空栈并摘掉监听。 */
export function resetDismissStackForTests(): void {
  entries.length = 0
  seqByToken = new WeakMap()
  nextSeq = 0
  pressSerial = 0
  stopListening()
}
