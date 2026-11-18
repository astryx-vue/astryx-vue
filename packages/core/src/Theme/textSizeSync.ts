/**
 * @file textSizeSync.ts
 * @input The reader's text size, measured from a hidden
 *   `font: -apple-system-body` probe, or `env(preferred-text-scale)`
 * @output syncReaderTextSize, which gives the page the scales dynamicType.ts
 *   describes and returns the cleanup
 * @position Theme runtime; the root Theme (useThemeRootSync.ts) starts it
 */

import { observeResize } from '../utils/sharedResizeObserver.js'
import { columnForBodySize, preferredTextScaleRule, scaleRuleForColumn } from './dynamicType.js'

const TEXT_SIZE_PROBE = 'data-astryx-text-size-probe'

/** Each document's shared probe and stylesheet, and how many roots hold them. */
const sharedSyncs = new WeakMap<
  Document,
  { holders: number, stop: () => void }
>()

/**
 * Measure the reader's text size and give the page its scales; returns the
 * cleanup. Where the engine has no `font: -apple-system-body`, every scale
 * reads `env(preferred-text-scale)` instead, unless the page carries the
 * text-scale meta. Does nothing where the engine cannot construct a
 * stylesheet; where its Body size names no category (macOS Safari's fixed
 * 13px), every scale stays 1.
 *
 * The probe is a hidden, empty `font: -apple-system-body` box, 1em square,
 * appended to `<body>` outside every app subtree: it renders no text, and it
 * resizes when the reader's text size changes, which is when the size is read
 * again. The scales go to a stylesheet the document adopts, so nothing else is
 * added to the DOM or written on `<html>`. A document has one probe and one
 * stylesheet however many root Themes it holds: they share them, and the last
 * one to go removes them.
 */
export function syncReaderTextSize(doc: Document): (() => void) | undefined {
  let shared = sharedSyncs.get(doc)
  if (shared == null) {
    const stop = startReaderTextSizeSync(doc)
    if (stop == null) {
      return undefined
    }
    shared = { holders: 0, stop }
    sharedSyncs.set(doc, shared)
  }
  shared.holders += 1
  const held = shared
  let isReleased = false
  return () => {
    if (isReleased) {
      return
    }
    isReleased = true
    held.holders -= 1
    if (held.holders === 0) {
      sharedSyncs.delete(doc)
      held.stop()
    }
  }
}

function startReaderTextSizeSync(doc: Document): (() => void) | undefined {
  const view = doc.defaultView
  if (
    view == null
    || typeof view.CSSStyleSheet !== 'function'
    || !Array.isArray(doc.adoptedStyleSheets)
  ) {
    return undefined
  }
  if (!view.CSS?.supports?.('font', '-apple-system-body')) {
    return startPreferredTextScale(doc, view)
  }

  const probe = doc.createElement('span')
  probe.setAttribute('aria-hidden', 'true')
  probe.setAttribute(TEXT_SIZE_PROBE, '')
  probe.style.cssText
    = 'position:fixed;inset:0 auto auto 0;inline-size:1em;block-size:1em;visibility:hidden;pointer-events:none;font:-apple-system-body';
  (doc.body ?? doc.documentElement).append(probe)

  const sheet = new view.CSSStyleSheet()
  doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet]
  const read = (): void =>
    sheet.replaceSync(
      scaleRuleForColumn(
        columnForBodySize(
          Number.parseFloat(view.getComputedStyle(probe).fontSize),
        ),
      ),
    )
  // observeResize reads once now and again whenever the probe resizes.
  const stopObserving = observeResize(probe, read)

  return () => {
    stopObserving()
    probe.remove()
    doc.adoptedStyleSheets = doc.adoptedStyleSheets.filter(
      adopted => adopted !== sheet,
    )
  }
}

/**
 * Give every scale `env(preferred-text-scale)`, which the engine keeps
 * current, so nothing is measured or observed. Does nothing on a page whose
 * text-scale meta already scales the root font size.
 */
function startPreferredTextScale(
  doc: Document,
  view: Window & typeof globalThis,
): (() => void) | undefined {
  if (doc.querySelector('meta[name="text-scale"][content="scale" i]') != null) {
    return undefined
  }
  const sheet = new view.CSSStyleSheet()
  sheet.replaceSync(preferredTextScaleRule())
  doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet]
  return () => {
    doc.adoptedStyleSheets = doc.adoptedStyleSheets.filter(
      adopted => adopted !== sheet,
    )
  }
}
