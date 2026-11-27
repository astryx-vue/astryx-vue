<script setup lang="ts">
/**
 * 可重排行末尾的手柄：一个切换按钮。鼠标按住拖过 4px、手指按住片刻后拖，都会拖动这一行；
 * 点一下（或空格、回车）进入重排模式，`aria-pressed` 表示模式开着。
 *
 * 名字跟着行走：行有自己的名字时叫「调整「名字」的顺序」；借行的标签元素命名时只写动词，
 * 后半句由 `aria-labelledby` 指过去；行没有能读的名字时按位置叫「调整第 N 项的顺序」。
 */
import type { ListReorderController } from './reorderController.js'
import type { ListReorderHandleProps } from './reorderTypes.js'
import { computed, onMounted, shallowRef, useId, useTemplateRef, watch } from 'vue'
import { useTouchHitArea } from '../../composables/internal/useTouchHitArea.js'
import { useComponentMessages } from '../../locale/context.js'
import { listMessages } from '../../locale/messages/list.js'
import { useListContext } from '../context.js'
import { useItemLabelId } from '../itemSlots.js'
import { listReorderHandleAttrs } from './reorderMarks.js'
import { UNREAD_HANDLE_NAME } from './reorderState.js'
import '../../../styles/list-reorder.css'

defineOptions({ name: 'AstryxListReorderHandle' })

const props = withDefaults(defineProps<ListReorderHandleProps>(), { isDisabled: false })

const button = useTemplateRef<HTMLButtonElement>('button')
const list = useListContext()
const controller = computed(() => list?.reorder.value?.session as ListReorderController | undefined)
const messages = useComponentMessages({ list: listMessages })
const labelId = useItemLabelId()
const verbId = `astryx-list-reorder-verb-${useId()}`

const text = computed(() => (props.label ?? '').replace(/\s+/g, ' ').trim())
const callerLabel = computed(() => props.rowLabel?.trim() || null)
const labelledBy = computed(() => (callerLabel.value != null ? undefined : (props.rowLabelledBy ?? labelId.value ?? undefined)))
const isNamed = computed(() => callerLabel.value != null || labelledBy.value != null || text.value !== '')
const byLabel = computed(() => labelId.value != null && labelledBy.value === labelId.value)

function labelText(): string {
  const id = labelId.value
  const element = id == null ? null : (button.value?.ownerDocument.getElementById(id) ?? null)
  return (element?.textContent ?? '').replace(/\s+/g, ' ').trim()
}

// 会话的读数（按位置命名、是否在模式里）不是响应式的：订阅它的通知，每次通知时重读。
const version = shallowRef(0)
function bump(): void {
  version.value += 1
}
onMounted(() => {
  watch(() => [controller.value, props.itemKey] as const, ([session, key], _previous, onCleanup) => {
    if (session == null)
      return
    onCleanup(session.registerHandle(button.value, key))
  }, { immediate: true, flush: 'post' })

  watch(
    () => [controller.value, callerLabel.value, text.value, labelId.value, byLabel.value, isNamed.value] as const,
    ([session, caller, shownText, id, isByLabel, named], _previous, onCleanup) => {
      if (session == null)
        return
      const handle = button.value
      const spoken = caller ?? (shownText !== '' ? shownText : labelText())
      const unname = session.registerName(handle, spoken)
      const unlabel = session.registerHandleLabel(handle, isByLabel ? id : null, named)
      onCleanup(() => {
        unname()
        unlabel()
      })
    },
    { immediate: true, flush: 'post' },
  )

  watch(controller, (session, _previous, onCleanup) => {
    if (session == null)
      return
    const offNames = session.subscribeHandleNames(bump)
    const offMode = session.subscribeMode(bump)
    bump()
    onCleanup(() => {
      offNames()
      offMode()
    })
  }, { immediate: true })

  // 手柄关掉或卸载时，结束它的拖动和重排模式。
  watch(() => [controller.value, props.isDisabled] as const, ([session, disabled], _previous, onCleanup) => {
    const handle = button.value
    if (session == null || disabled)
      return
    onCleanup(() => session.release(handle))
  }, { immediate: true })
})

const shown = computed(() => {
  void version.value
  return controller.value?.handleNameOf(button.value) ?? UNREAD_HANDLE_NAME
})
const isPressed = computed(() => {
  void version.value
  return controller.value?.isInMode(button.value) ?? false
})

const labelShowsName = computed(() => byLabel.value && !shown.value.labelShowsNoName)
const byPlace = computed(() => (byLabel.value ? !labelShowsName.value : !isNamed.value))
const shownLabelledBy = computed(() => (byLabel.value && !labelShowsName.value ? undefined : labelledBy.value))
const name = computed(() => {
  const list = messages.value.list
  if (byPlace.value && shown.value.position != null)
    return list.reorderHandleAt(shown.value.position)
  if (callerLabel.value != null)
    return list.reorderHandle(callerLabel.value)
  if (labelledBy.value != null)
    return list.reorderHandleVerb
  return text.value !== '' ? list.reorderHandle(text.value) : undefined
})

useTouchHitArea(button, computed(() => controller.value != null && !props.isDisabled))

function onClick(): void {
  const session = controller.value
  if (session != null && !session.takeDrag(button.value) && !props.isDisabled)
    session.toggleMode(button.value)
}

function onKeyDown(event: KeyboardEvent): void {
  if (!props.isDisabled)
    controller.value?.keyDown(button.value, event)
}

function onBlur(event: FocusEvent): void {
  controller.value?.blur(button.value, event.relatedTarget)
}

/** 手指长按手柄不弹出菜单：那是拖动的开始。 */
function onContextMenu(event: MouseEvent): void {
  if ((event as Partial<PointerEvent>).pointerType === 'touch') {
    event.preventDefault()
    event.stopPropagation()
  }
}
</script>

<template>
  <button
    v-if="controller"
    :id="shownLabelledBy == null ? undefined : verbId"
    ref="button"
    type="button"
    class="astryx-list-reorder-handle astryx-touch-hit-area"
    v-bind="listReorderHandleAttrs"
    data-astryx-pressable=""
    :data-row-align="rowAlign"
    :aria-label="name"
    :aria-labelledby="shownLabelledBy == null ? undefined : `${verbId} ${shownLabelledBy}`"
    :aria-describedby="controller.hintId"
    :aria-disabled="isDisabled || undefined"
    :aria-pressed="isPressed"
    @click="onClick"
    @keydown="onKeyDown"
    @blur="onBlur"
    @pointerdown.stop
    @touchstart.stop.passive
    @contextmenu="onContextMenu"
  />
</template>
