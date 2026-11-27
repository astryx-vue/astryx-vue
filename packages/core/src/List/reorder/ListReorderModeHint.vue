<script setup lang="ts">
/**
 * 重排模式的提示：挂在手柄下方、起始边对齐，和键盘提示同一种外观，但里面是按钮。
 * 「上移」「下移」和「完成」让只用点按的人也能一格一格挪。
 * 按钮不进 Tab 顺序，按下时不抢焦点，焦点留在手柄上。Escape 结束模式。
 */
import type { CSSProperties } from 'vue'
import type { ListReorderController } from './reorderController.js'
import { computed, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import { useResolvedLayerTeleport } from '../../composables/useLayerMountTarget.js'
import Kbd from '../../Kbd/Kbd.vue'
import { pushLayer } from '../../layer/dismissStack.js'
import { useComponentMessages } from '../../locale/context.js'
import { listMessages } from '../../locale/messages/list.js'
import ListReorderHintButton from './ListReorderHintButton.vue'
import '../../../styles/keyboard-hint.css'
import '../../../styles/layer.css'
import '../../../styles/list-reorder.css'

const props = defineProps<{ controller: ListReorderController }>()

/** 提示和手柄之间的距离，px（spacing-2）。 */
const GAP = 8

const messages = useComponentMessages({ list: listMessages })
const target = shallowRef<HTMLElement | null>(null)
const sentinel = useTemplateRef<HTMLElement>('sentinel')
const hint = useTemplateRef<HTMLElement>('hint')
const teleportTarget = useResolvedLayerTeleport(sentinel)
const position = shallowRef({ top: 0, insetInlineStart: 0 })

const style = computed<CSSProperties>(() => ({
  top: `${position.value.top}px`,
  insetInlineStart: `${position.value.insetInlineStart}px`,
}))

function place(): void {
  const anchor = target.value
  if (anchor == null)
    return
  const rect = anchor.getBoundingClientRect()
  const view = anchor.ownerDocument.defaultView
  const isRtl = getComputedStyle(anchor).direction === 'rtl'
  position.value = {
    top: rect.bottom + GAP,
    insetInlineStart: isRtl ? (view?.innerWidth ?? 0) - rect.right : rect.left,
  }
}

let unsubscribeMode: (() => void) | null = null
let unregisterLayer: (() => void) | null = null
const token = {}

onMounted(() => {
  const read = (): void => {
    target.value = props.controller.modeTarget
  }
  read()
  unsubscribeMode = props.controller.subscribeMode(read)
  window.addEventListener('scroll', place, true)
  window.addEventListener('resize', place)
})

watch(target, (anchor) => {
  unregisterLayer?.()
  unregisterLayer = null
  if (anchor == null)
    return
  place()
  unregisterLayer = pushLayer({
    token,
    getTrigger: () => target.value,
    getContainer: () => hint.value ?? null,
    dismissOnPointerOutside: false,
    dismissOnEscape: 'close',
    onDismiss: () => props.controller.endMode(),
  })
}, { flush: 'post' })

watch(hint, element => props.controller.setHintElement(element ?? null), { flush: 'post' })

onBeforeUnmount(() => {
  unsubscribeMode?.()
  unregisterLayer?.()
  props.controller.setHintElement(null)
  window.removeEventListener('scroll', place, true)
  window.removeEventListener('resize', place)
})

function step(delta: -1 | 1): void {
  props.controller.step(target.value, delta)
}
</script>

<template>
  <span ref="sentinel" hidden />
  <Teleport v-if="target" :to="teleportTarget">
    <span
      ref="hint"
      class="astryx-layer astryx-keyboard-hint astryx-list-reorder-hint"
      :style="style"
    >
      <span class="astryx-keyboard-hint__keys">
        <ListReorderHintButton :label="messages.list.reorderMoveUp" @press="step(-1)">
          <Kbd keys="up" aria-hidden="true" />
        </ListReorderHintButton>
        <ListReorderHintButton :label="messages.list.reorderMoveDown" @press="step(1)">
          <Kbd keys="down" aria-hidden="true" />
        </ListReorderHintButton>
        <ListReorderHintButton is-text @press="controller.endMode()">
          {{ messages.list.reorderDone }}
        </ListReorderHintButton>
      </span>
    </span>
  </Teleport>
</template>
