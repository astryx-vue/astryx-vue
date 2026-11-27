/**
 * The boxes a touch on the sheet's body can scroll, and the edges they sit at.
 *
 * The body is where the sheet listens, but it is not always what scrolls: a
 * host can pin a header and footer around a scrolling middle, or lay a
 * scrolling grid inside the sheet. The browser scrolls the innermost box that
 * has room and then chains outward, so a pull belongs to the sheet only when
 * every box in the chain sits at the edge the pull opposes.
 */

/** A box a finger or a wheel can scroll along the block axis. */
function isBlockScroller(element: HTMLElement): boolean {
  if (element.scrollHeight - element.clientHeight <= 1)
    return false
  const { overflowY } = getComputedStyle(element)
  return overflowY === 'auto' || overflowY === 'scroll'
}

/** Every scroller between `target` and `body`, innermost first, then the body itself. */
export function scrollChainUnder(target: EventTarget | null, body: HTMLElement): HTMLElement[] {
  const chain: HTMLElement[] = []
  for (
    let element = target instanceof Element ? target : null;
    element != null && element !== body;
    element = element.parentElement
  ) {
    if (element instanceof HTMLElement && isBlockScroller(element))
      chain.push(element)
  }
  chain.push(body)
  return chain
}

/** Nothing in the chain can scroll up any further, so a pull down is the sheet's. */
export function chainAtTop(chain: readonly HTMLElement[]): boolean {
  return chain.every(element => element.scrollTop <= 0)
}

/** Nothing in the chain can scroll down any further, so a pull up is the sheet's. */
export function chainAtBottom(chain: readonly HTMLElement[]): boolean {
  return chain.every(element => element.scrollTop + element.clientHeight >= element.scrollHeight - 1)
}

/** Whether any box in the chain has content to scroll. */
export function chainScrolls(chain: readonly HTMLElement[]): boolean {
  return chain.some(element => element.scrollHeight - element.clientHeight > 1)
}

/**
 * iOS rubber-bands a scroller past its end even under `overscroll-behavior:
 * contain`. While the content sits at its end mid-pull, `none` holds it still,
 * so only the sheet moves. Returns the undo.
 */
export function holdAtEnd(chain: readonly HTMLElement[]): () => void {
  const previous = chain.map(element => element.style.overscrollBehaviorY)
  for (const element of chain)
    element.style.overscrollBehaviorY = 'none'
  return () => {
    chain.forEach((element, index) => {
      element.style.overscrollBehaviorY = previous[index] ?? ''
    })
  }
}
