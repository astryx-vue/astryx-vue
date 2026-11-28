import type { BottomSheetReplaceMotion, Entry } from './stackState.js'
import { isSheetHostPresented } from './sheetHost.js'
import { compareRank, groupOf, state } from './stackState.js'

/**
 * 替换交接：同一次更新里一张关、一张开，而且是人从关掉的那张里动手换到下一张。
 */

const ALIGNMENT_THRESHOLD_PX = 1

/**
 * 把本批的一关一开配成替换。条件逐条对应「人从这一张换到下一张」：
 *
 * - 这次更新里正好关了一张、开了一张；
 * - 两张都是独立面板，属于同一组（同一 document，同是模态或同是非模态）；
 * - 把新开的那张放一边，关掉的那张原来在最上面：被盖住的面板关掉、同时开一张，是下面出栈上面入栈；
 * - 两个对话框互不包含：内容里的面板跟着外面那张一起关，不是替换它；
 * - 动作来自关掉的那张：人最后按下的控件（没有新近按压就看这次更新第一次翻转时焦点在哪）
 *   在它的对话框里，或者哪里都不在（控件跟着那一步走了）。从外面的控件同时关一张开一张，
 *   是两个不相干的主人在同一次更新里各做各的，两张面板保留各自的打开者和进退动效。
 *
 * 配成后新开的那张接过关掉那张的打开者：它自己的打开者在要离开的那张里，流程是从关掉那张的起点开始的。
 */
export function detectReplace(): void {
  if (state.batchOpened.length !== 1 || state.batchClosed.length !== 1) {
    // 本批先前配好、之后又来了第三次翻转的那一对要撤销：几张面板一起变时保留各自的进退动效。
    undoBatchPair()
    return
  }
  const [replacer] = state.batchOpened
  const [replaced] = state.batchClosed
  if (state.batchPair != null && state.batchPair.replaced === replaced)
    return
  if (
    replaced === replacer
    || replaced.replaceable == null
    || replacer.replaceable == null
    || replaced.doc !== replacer.doc
    || replaced.isModal !== replacer.isModal
    || replaced.replace?.replacer === replacer
    || !replacer.isOpen
    || replaced.isOpen
  ) {
    return
  }
  const replacedElement = replaced.getElement()
  const replacerElement = replacer.getElement()
  if (
    replacedElement == null
    || replacerElement == null
    || replacedElement.contains(replacerElement)
    || replacerElement.contains(replacedElement)
  ) {
    return
  }
  const wasTop = !groupOf(replaced).some(other =>
    other !== replacer && other !== replaced && other.isOpen && compareRank(other, replaced) > 0,
  )
  if (!wasTop)
    return
  const actor = state.batchActor
  if (actor != null && actor !== replaced.doc.body && !replacedElement.contains(actor))
    return
  // 关掉的那张自己正在替换的第三张立刻丢掉，就像切换器丢掉交接到一半被离开的那一步。
  // 它正在替换的如果就是现在回来的这张（往回走），角色互换，什么都不丢。
  if (replaced.replacing != null && replaced.replacing !== replacer)
    finishReplace(replaced.replacing)
  if (replaced.replace != null)
    replaced.replace.replacer.replacing = null
  if (replacer.replace != null)
    replacer.replace = null
  replaced.replace = {
    replacer,
    motion: 'covered',
    alignmentOffset: 0,
    isAlignmentComplete: false,
    isEnteringComplete: false,
  }
  replacer.replacing = replaced
  state.batchPair = { replaced, replacer, replacerOpener: replacer.replaceable.getOpener() }
  // 促成这次替换的按压用掉了。
  state.lastPress.delete(replacer.doc)
  replacer.replaceable.setOpener(replaced.replaceable.getOpener())
  state.pendingReplaceFocus = replacer
}

/** 撤销本批配成的一对：被替换的那张恢复成普通的关闭，替换者恢复自己的打开者，也不再欠焦点。 */
export function undoBatchPair(): void {
  const pair = state.batchPair
  if (pair == null)
    return
  state.batchPair = null
  const { replaced, replacer, replacerOpener } = pair
  if (replaced.replace?.replacer === replacer)
    replaced.replace = null
  if (replacer.replacing === replaced)
    replacer.replacing = null
  replacer.replaceable?.setOpener(replacerOpener)
  if (state.pendingReplaceFocus === replacer)
    state.pendingReplaceFocus = null
}

/** 人从被替换的那一步换到进场的那一步，焦点也跟过去；对话框呈现之后才做。 */
export function focusPendingReplacer(): void {
  const replacer = state.pendingReplaceFocus
  if (replacer == null)
    return
  const element = replacer.getElement()
  if (element == null || !isSheetHostPresented(element))
    return
  state.pendingReplaceFocus = null
  replacer.focus('replace')
}

/** 结束替换：被替换的面板藏起、对话框关掉；下一次算视图时遮罩交给替换它的那张。焦点不动。 */
export function finishReplace(replaced: Entry): void {
  const replace = replaced.replace
  if (replace == null)
    return
  const { replacer } = replace
  replaced.replace = null
  if (replacer.replacing === replaced)
    replacer.replacing = null
  replaced.hide()
  replaced.replaceable?.finish()
}

/** 丢掉本批里替换者自己关掉了、又没被本批哪次替换接回去的被替换面板。 */
export function flushPendingDrops(): void {
  if (state.pendingDrops.length === 0)
    return
  const drops = state.pendingDrops
  state.pendingDrops = []
  for (const replaced of drops) {
    const replacer = replaced.replace?.replacer
    if (replacer != null && !replacer.isOpen)
      finishReplace(replaced)
  }
}

/**
 * 面板静止时的视口顶边：它的盒子去掉还在走的位移（进场的面板正从视口下面升上来）。
 * 从面板自己身上量，不看外面那层：独立面板的面板直接在铺满视口的对话框里，外层的顶边不是面板停的地方。
 */
export function restingTopOfPanel(panel: HTMLElement): number {
  const top = panel.getBoundingClientRect().top
  const view = panel.ownerDocument.defaultView
  if (view == null || typeof view.DOMMatrixReadOnly !== 'function')
    return top
  const { transform } = view.getComputedStyle(panel)
  if (transform === '' || transform === 'none')
    return top
  // 面板只在块方向上平移（进场、拖动、对齐），算出来的矩阵的 m42 就是那段位移。
  try {
    return top - new view.DOMMatrixReadOnly(transform).m42
  }
  catch {
    return top
  }
}

/** 被替换的面板（静止）要向下移多少，才能和进场面板最终停下的顶边对齐。 */
export function alignmentOffsetForPanels(entering: HTMLElement | null, retained: HTMLElement | null): number {
  if (entering == null || retained == null)
    return 0
  return Math.max(0, restingTopOfPanel(entering) - retained.getBoundingClientRect().top)
}

/**
 * 面板动作的开始和结束。替换期间由它推进交接：进场的面板开始升起时，比它高的被替换面板开始
 * 向下对齐；两边都走完后被替换的面板淡出；淡出结束替换就完了。返回要不要重新算视图。
 */
export function applyMotionReport(entry: Entry, event: 'start' | 'complete', motion: BottomSheetReplaceMotion): boolean {
  if (motion === 'entering') {
    const replaced = entry.replacing
    const replace = replaced?.replace ?? null
    if (replaced == null || replace == null || replace.replacer !== entry)
      return false
    if (event === 'start') {
      if (replace.motion !== 'covered')
        return false
      const offset = alignmentOffsetForPanels(
        entry.replaceable?.getPanel() ?? null,
        replaced.replaceable?.getPanel() ?? null,
      )
      if (offset > ALIGNMENT_THRESHOLD_PX) {
        replace.motion = 'aligning'
        replace.alignmentOffset = offset
        replace.isAlignmentComplete = false
      }
      // 淡出途中又回来的面板已经在该在的位置：它的进场一开始就算走完了。
      if (entry.isEnteringInPlace) {
        entry.isEnteringInPlace = false
        replace.isEnteringComplete = true
        if (replace.motion !== 'aligning')
          replace.motion = 'fading'
      }
      else if (replace.motion === 'covered') {
        return false
      }
    }
    else {
      replace.isEnteringComplete = true
      if (replace.motion === 'aligning' && !replace.isAlignmentComplete)
        return false
      replace.motion = 'fading'
    }
    return true
  }
  const replace = entry.replace
  if (replace == null || event !== 'complete')
    return false
  if (motion === 'aligning' && replace.motion === 'aligning') {
    if (replace.isEnteringComplete)
      replace.motion = 'fading'
    else
      replace.isAlignmentComplete = true
    return true
  }
  if (motion === 'fading' && replace.motion === 'fading') {
    finishReplace(entry)
    return true
  }
  return false
}
