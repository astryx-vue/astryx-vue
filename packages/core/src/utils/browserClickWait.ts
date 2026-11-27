/**
 * @file browserClickWait.ts
 * @input A control's element after a lift the browser may or may not click
 * @output awaitBrowserClick: waits for the browser's own click on an element
 *   and reports whether it came; clickAndReport and clickForLift: a control's
 *   own click on its input, the latter with the shared click guard armed for
 *   the browser's late click of the same lift
 * @position Shared by the touch controls that decide a lift themselves
 *   (Switch), over utils/clickGuard.ts and utils/inputStream.ts
 *
 * A finger's hold gets no click from the browser, while a tap does. A control
 * that toggles on either waits for the browser's click first, so the native
 * path (form value, change event, label) runs once, and clicks its input
 * itself only when none came.
 */

import { armClickGuard, withoutClickGuard } from './clickGuard'
import { subscribeInput } from './inputStream'

/** How long a lift waits for the browser's own click, ms. */
export const BROWSER_CLICK_WAIT_MS = 300

export interface BrowserClickWaitHandlers {
  /** The browser's click ran its handlers. `isCancelled`: one cancelled it. */
  readonly onClicked: (isCancelled: boolean) => void
  /** No browser click came in time. */
  readonly onNoClick: () => void
}

/**
 * Waits for the browser's trusted click inside `target`. Reports it after its
 * handlers ran (a task later), or that none came within the wait. Returns
 * the function that ends the wait without a report.
 */
export function awaitBrowserClick(target: Element, { onClicked, onNoClick }: BrowserClickWaitHandlers): () => void {
  const view = target.ownerDocument.defaultView
  if (view == null) {
    let isEnded = false
    queueMicrotask(() => {
      if (!isEnded)
        onNoClick()
    })
    return () => {
      isEnded = true
    }
  }
  let isDone = false
  let report: number | null = null
  let timer: number | null = null
  let stopListening: (() => void) | null = null
  const stop = (): void => {
    isDone = true
    stopListening?.()
    stopListening = null
    if (timer != null) {
      view.clearTimeout(timer)
      timer = null
    }
  }
  stopListening = subscribeInput(view, 'click', (event) => {
    if (isDone || !event.isTrusted || !target.contains(event.target as Node | null))
      return
    stop()
    report = view.setTimeout(() => {
      report = null
      onClicked(event.defaultPrevented)
    }, 0)
  })
  timer = view.setTimeout(() => {
    if (isDone)
      return
    stop()
    onNoClick()
  }, BROWSER_CLICK_WAIT_MS)
  return () => {
    stop()
    if (report != null) {
      view.clearTimeout(report)
      report = null
    }
  }
}

/** Clicks `element` and reports whether a handler cancelled the click. */
export function clickAndReport(element: HTMLElement): boolean {
  const view = element.ownerDocument.defaultView
  let clicked: Event | null = null
  const grab = (event: Event): void => {
    if (clicked == null && event.target === element)
      clicked = event
  }
  view?.addEventListener('click', grab, true)
  try {
    element.click()
  }
  finally {
    view?.removeEventListener('click', grab, true)
  }
  return (clicked as Event | null)?.defaultPrevented === true
}

/**
 * A control's own click for a lift: the shared click guard swallows the
 * browser's late click of the same lift, so the control toggles once.
 */
export function clickForLift(element: HTMLElement): boolean {
  armClickGuard(element.ownerDocument)
  return withoutClickGuard(() => clickAndReport(element))
}
