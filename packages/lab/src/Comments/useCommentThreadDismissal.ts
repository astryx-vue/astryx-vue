import type { AnnounceFn } from '@astryx-vue/core'
import type { MaybeRefOrGetter, Ref } from 'vue'
import type { CommentsContextValue } from './commentsContext.js'
import { useDismiss, useTranslator } from '@astryx-vue/core'
import { computed, onScopeDispose, ref, toValue, watch, watchEffect } from 'vue'
import { commentAnchorId, replyComposerId } from './utils.js'

export type UnsavedDraft
  = | { kind: 'reply', parentId: string, signature: string }
    | { kind: 'edit', commentId: string, signature: string }

/**
 * The thread's unsaved draft, derived from the controller's state: a reply
 * holding more than its seeded mention, or an edit whose text differs from
 * the saved body. Whitespace alone is never a draft.
 */
export function unsavedDraftOf({
  replyTarget,
  replyDraft,
  editTarget,
}: Pick<CommentsContextValue, 'replyTarget' | 'replyDraft' | 'editTarget'>): UnsavedDraft | null {
  if (editTarget != null && editTarget.value.trim() !== editTarget.comment.body.trim()) {
    return {
      kind: 'edit',
      commentId: editTarget.comment.id,
      signature: `edit:${editTarget.comment.id}:${editTarget.value}`,
    }
  }
  if (replyTarget != null) {
    const typed = replyDraft.trim()
    if (typed !== '' && typed !== (replyTarget.seed ?? '').trim()) {
      return {
        kind: 'reply',
        parentId: replyTarget.parentId,
        signature: `reply:${replyTarget.parentId}:${replyDraft}`,
      }
    }
  }
  return null
}

type RequestOutcome = 'dismissed' | 'guarded'

export interface CommentThreadDismissalOptions {
  onDismiss: MaybeRefOrGetter<(() => void) | undefined>
  rootRef: Ref<HTMLElement | null>
  draft: Ref<UnsavedDraft | null>
  announce: AnnounceFn
}

export interface CommentThreadDismissalReturn {
  isEnabled: boolean
  onRootPointerDownCapture: (event: PointerEvent) => void
}

const DRAFT_INPUT_SELECTOR = [
  '[contenteditable="true"]',
  '[role="textbox"]',
  'textarea',
  'input:not([type="hidden"]):not([type="file"])',
].join(', ')

const DEFAULT_SHAKE_DURATION_MS = 410
const DEFAULT_SHAKE_DISTANCE = '4px'

function parseDuration(value: string | undefined): number | null {
  const normalized = value?.trim() ?? ''
  const amount = Number.parseFloat(normalized)
  if (!Number.isFinite(amount))
    return null
  if (normalized.endsWith('ms'))
    return amount
  return normalized.endsWith('s') ? amount * 1000 : null
}

function hostSurfaceOf(root: HTMLElement): HTMLElement | null {
  return root.parentElement?.closest<HTMLElement>('[popover]') ?? null
}

function hostTriggerOf(doc: Document, host: HTMLElement): Element | null {
  if (host.id === '')
    return null
  for (const element of doc.querySelectorAll('[aria-controls]')) {
    if (element.getAttribute('aria-controls')?.split(/\s+/).includes(host.id) === true)
      return element
  }
  return null
}

function claimNext(
  doc: Document,
  type: 'mousedown' | 'click',
  owns: (target: EventTarget | null) => boolean,
): void {
  function release(): void {
    doc.removeEventListener(type, claim, true)
    doc.removeEventListener('pointerdown', release, true)
    doc.removeEventListener('keydown', release, true)
  }
  function claim(event: Event): void {
    release()
    if (owns(event.target)) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
  doc.addEventListener(type, claim, true)
  doc.addEventListener('pointerdown', release, true)
  doc.addEventListener('keydown', release, true)
}

function focusDraftInput(root: HTMLElement, draft: UnsavedDraft): void {
  const doc = root.ownerDocument
  const region = doc.getElementById(
    draft.kind === 'reply' ? replyComposerId(draft.parentId) : commentAnchorId(draft.commentId),
  )
  let input: HTMLElement | null = null
  for (const candidate of region?.querySelectorAll<HTMLElement>(DRAFT_INPUT_SELECTOR) ?? []) {
    const layer = candidate.closest('[popover], [role="dialog"]')
    if (layer == null || !region?.contains(layer)) {
      input = candidate
      break
    }
  }
  if (input == null) {
    root.focus()
    return
  }
  const selection = doc.getSelection()
  const existing
    = selection != null
      && selection.rangeCount > 0
      && input.contains(selection.getRangeAt(0)!.commonAncestorContainer)
      ? selection.getRangeAt(0)!.cloneRange()
      : null
  input.focus()
  if (selection == null || input.getAttribute('contenteditable') !== 'true')
    return
  let range = existing
  if (range == null) {
    range = doc.createRange()
    range.selectNodeContents(input)
    range.collapse(false)
  }
  selection.removeAllRanges()
  selection.addRange(range)
}

function prefersReducedMotion(element: HTMLElement): boolean {
  return element.ownerDocument.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

function isDisplayedLayer(element: HTMLElement): boolean {
  if (element.hidden)
    return false
  if (element instanceof HTMLDialogElement && !element.open)
    return false
  if (element.hasAttribute('popover') && !element.matches(':popover-open'))
    return false
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  if (style != null && (style.display === 'none' || style.visibility === 'hidden' || style.contentVisibility === 'hidden'))
    return false
  return true
}

function hasLayerAbove(root: HTMLElement): boolean {
  const host = hostSurfaceOf(root)
  const open = document.querySelectorAll('[popover]:popover-open, dialog[open], [role="dialog"]')
  for (const element of open) {
    if (!(element instanceof HTMLElement) || !isDisplayedLayer(element))
      continue
    if (element === root || root.contains(element))
      continue
    if (host != null && (element === host || host.contains(element)))
      continue
    return true
  }
  return false
}

export function useCommentThreadDismissal({
  onDismiss,
  rootRef,
  draft,
  announce,
}: CommentThreadDismissalOptions): CommentThreadDismissalReturn {
  const { t } = useTranslator()
  const isEnabled = computed(() => toValue(onDismiss) != null)
  const guardedSignatureRef = ref<string | null>(null)
  const insidePressRef = ref<Event | null>(null)
  const shakeRef = ref<Animation | null>(null)
  const enabledRef = computed(() => isEnabled.value)

  const shake = (root: HTMLElement): void => {
    shakeRef.value?.cancel()
    shakeRef.value = null
    const duration = parseDuration(
      getComputedStyle(root).getPropertyValue('--astryx-duration-medium') || undefined,
    ) ?? DEFAULT_SHAKE_DURATION_MS
    if (duration <= 0 || typeof root.animate !== 'function' || prefersReducedMotion(root))
      return
    const distance
      = getComputedStyle(root).getPropertyValue('--astryx-spacing-1').trim() || DEFAULT_SHAKE_DISTANCE
    const at = (factor: number): { transform: string } => ({ transform: `translateX(calc(${distance} * ${factor}))` })
    try {
      const animation = root.animate(
        [at(0), at(-1), at(1), at(-0.5), at(0.5), at(0)],
        { duration, easing: 'ease-in-out', composite: 'add' },
      )
      shakeRef.value = animation
      const forget = (): void => {
        if (shakeRef.value === animation)
          shakeRef.value = null
      }
      animation.addEventListener('finish', forget)
      animation.addEventListener('cancel', forget)
    }
    catch {
      // Motion is progressive enhancement; focus and the announcement remain.
    }
  }

  const request = (): RequestOutcome => {
    const current = draft.value
    if (current == null || guardedSignatureRef.value === current.signature) {
      guardedSignatureRef.value = null
      toValue(onDismiss)?.()
      return 'dismissed'
    }
    guardedSignatureRef.value = current.signature
    const root = rootRef.value
    if (root != null) {
      shake(root)
      focusDraftInput(root, current)
    }
    announce(t('@astryx.comments.unsavedDraft'), 'polite')
    return 'guarded'
  }

  const wouldGuard = (): boolean => draft.value != null && guardedSignatureRef.value !== draft.value.signature
  const latestRef = ref<{ request: () => RequestOutcome, wouldGuard: () => boolean } | null>(null)
  watchEffect(() => {
    latestRef.value = { request, wouldGuard }
  })

  useDismiss({
    container: rootRef,
    isEnabled: enabledRef,
    dismissOnPointerOutside: false,
    dismissOnEscape: 'close',
    onDismiss: () => { void latestRef.value?.request() },
  })

  let boundPointerDoc: Document | null = null
  let pending: { pointerId: number, trigger: Element | null } | null = null
  let handlePointerDown: ((event: PointerEvent) => void) | null = null
  let handlePointerUp: ((event: PointerEvent) => void) | null = null
  let handlePointerCancel: ((event: PointerEvent) => void) | null = null

  const unbindPointerListeners = (): void => {
    if (boundPointerDoc == null)
      return
    if (handlePointerDown != null)
      boundPointerDoc.removeEventListener('pointerdown', handlePointerDown)
    if (handlePointerUp != null)
      boundPointerDoc.removeEventListener('pointerup', handlePointerUp, true)
    if (handlePointerCancel != null)
      boundPointerDoc.removeEventListener('pointercancel', handlePointerCancel, true)
    boundPointerDoc = null
    pending = null
  }

  const bindPointerListeners = (doc: Document): void => {
    if (boundPointerDoc === doc)
      return
    unbindPointerListeners()
    handlePointerDown = (event: PointerEvent) => {
      pending = null
      const insidePress = insidePressRef.value
      insidePressRef.value = null
      // happy-dom may omit `isPrimary`; only skip when it is explicitly false,
      // or when the button is not the primary one.
      if (insidePress === event || event.isPrimary === false || event.button !== 0)
        return
      const root = rootRef.value
      const target = event.target
      if (root == null || !(target instanceof Node) || root.contains(target))
        return
      const host = hostSurfaceOf(root)
      if (host?.contains(target) === true)
        return
      if (hasLayerAbove(root))
        return
      const trigger = host == null ? null : hostTriggerOf(doc, host)
      pending = {
        pointerId: event.pointerId,
        trigger: trigger?.contains(target) === true ? trigger : null,
      }
      if (latestRef.value?.wouldGuard() === true)
        claimNext(doc, 'mousedown', () => true)
    }
    handlePointerUp = (event: PointerEvent) => {
      if (pending == null || event.pointerId !== pending.pointerId)
        return
      const { trigger } = pending
      pending = null
      if (latestRef.value?.request() === 'guarded')
        claimNext(doc, 'click', () => true)
      else if (trigger != null)
        claimNext(doc, 'click', target => target instanceof Node && trigger.contains(target))
    }
    handlePointerCancel = (event: PointerEvent) => {
      if (pending?.pointerId === event.pointerId)
        pending = null
    }
    doc.addEventListener('pointerdown', handlePointerDown)
    doc.addEventListener('pointerup', handlePointerUp, true)
    doc.addEventListener('pointercancel', handlePointerCancel, true)
    boundPointerDoc = doc
  }

  watch(enabledRef, (enabled) => {
    if (!enabled) {
      unbindPointerListeners()
      return
    }
    bindPointerListeners(rootRef.value?.ownerDocument ?? document)
  }, { immediate: true, flush: 'post' })

  watch(rootRef, (root) => {
    if (!enabledRef.value)
      return
    bindPointerListeners(root?.ownerDocument ?? document)
  })

  onScopeDispose(unbindPointerListeners)

  return {
    get isEnabled() {
      return isEnabled.value
    },
    onRootPointerDownCapture: (event: PointerEvent) => {
      if (!isEnabled.value)
        return
      insidePressRef.value = event
      guardedSignatureRef.value = null
    },
  }
}
