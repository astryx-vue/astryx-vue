<script setup lang="ts">
import type { VNode } from 'vue'
import type { BottomSheetPanelMotion, BottomSheetPanelState } from './panelState.js'
import type { ScrimFade } from './sheetDragExit.js'
import type { BottomSheetSwitcherContext, BottomSheetSwitcherPhase } from './switcher.js'
import type { BottomSheetHeight, BottomSheetMotion, BottomSheetPadding, BottomSheetPurpose, BottomSheetSnapPoint } from './types.js'
import { computed, onBeforeUnmount, onMounted, provide, useAttrs, useTemplateRef, watch } from 'vue'
import { provideNestedLayerMountTarget } from '../layer/mount.js'
import BottomSheetPanel from './BottomSheetPanel.vue'
import { bottomSheetEscapeKey } from './escape.js'
import { focusSheetPanel } from './focusSheetPanel.js'
import { isPublicMotion } from './panelState.js'
import { bottomSheetHostKey } from './sheetHostContext.js'
import { presentStepModally, presentWithClearScrim } from './stack/sheetHost.js'
import { stackRecedeClasses, stackStateAttribute, writeScrimFade } from './stack/stackPresentation.js'
import { bottomSheetSwitcherKey } from './switcher.js'

/** 切换器里的一步：自己有一个原生 dialog，什么时候呈现、什么时候关由切换器决定。 */
defineOptions({ name: 'AstryxBottomSheetStep', inheritAttrs: false })

const props = defineProps<{
  switcher: BottomSheetSwitcherContext
  sheetId: string
  label: string
  height?: BottomSheetHeight | number | string
  padding?: BottomSheetPadding
  snapPoints?: readonly BottomSheetSnapPoint[]
  purpose: BottomSheetPurpose
}>()

const emit = defineEmits<{
  snap: [visibleHeight: number]
  motionStart: [motion: BottomSheetMotion]
  motionComplete: [motion: BottomSheetMotion]
}>()

defineSlots<{ default?: () => VNode[] }>()

const attrs = useAttrs()
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const panel = useTemplateRef<InstanceType<typeof BottomSheetPanel>>('panel')
provideNestedLayerMountTarget(useTemplateRef<HTMLElement>('layerHost'))

const switcher = props.switcher
const phase = computed<BottomSheetSwitcherPhase>(() => switcher.phaseOf(props.sheetId))
const isInteractive = computed(() => phase.value === 'active' || phase.value === 'entering')
const isInactive = computed(() => phase.value === 'covered' || phase.value === 'aligning' || phase.value === 'fading' || phase.value === 'exiting')
const isPresented = computed(() => phase.value !== 'hidden')
const ownsScrim = computed(() => switcher.isScrimOwner(props.sheetId))
const isHost = computed(() => switcher.isHost(props.sheetId))
const isSettled = computed(() => isPresented.value && switcher.settledId.value === props.sheetId)
// 整段流程在叠放里算一层：流程外面有面板盖住它时每一步的对话框都挡住；交接期间这一步自己也不能操作。
const isBlocked = computed(() => isInactive.value || (switcher.hasScrim() && switcher.stackView.value.isBlocked))

const panelState = computed<BottomSheetPanelState>(() => {
  if (isInteractive.value)
    return 'open'
  if (phase.value === 'exiting')
    return 'exiting'
  return isInactive.value ? 'retained' : 'hidden'
})
const retainedMotion = computed(() => phase.value === 'aligning' || phase.value === 'fading' ? phase.value : 'covered')

// 这一步的内容另起一个范围：里面的 BottomSheet 是独立的，只在这一步是当前那步时呈现。
provide(bottomSheetSwitcherKey, null)
provide(bottomSheetHostKey, { isOpen: isInteractive })
provide(bottomSheetEscapeKey, () => true)

function register(id: string): void {
  switcher.register(id, {
    getDialog: () => dialog.value ?? null,
    getPanel: () => panel.value?.element ?? null,
    purpose: () => props.purpose,
  })
}
register(props.sheetId)
watch(() => props.sheetId, (id, previous) => {
  switcher.unregister(previous)
  register(id)
})

/**
 * 切换器把这一步留在屏幕上时呈现它自己的对话框，藏起来之后关掉。带遮罩的流程以模态呈现：进场的对话框
 * 压在被留下的那个上面，被留下的那个等面板淡出后才关。回到一个还在淡出、仍开在更新对话框下面的步骤时，
 * 重新呈现让它回到最上面：文档被最上面的模态对话框挡住，压在下面的不管切换器怎么说都是 inert。
 */
let dialogMode: 'modal' | 'non-modal' | null = null
function syncDialog(): void {
  const element = dialog.value
  if (element == null)
    return
  if (!isPresented.value) {
    if (element.open)
      element.close()
    dialogMode = null
    switcher.afterStepSync(props.sheetId)
    return
  }
  const hasScrim = switcher.hasScrim()
  const nextMode = hasScrim ? 'modal' : 'non-modal'
  // 登记表恢复打开顺序时已经把宿主对话框模态呈现了，接过来就行。
  if (element.open && dialogMode == null && hasScrim)
    dialogMode = nextMode
  if (element.open && dialogMode !== nextMode)
    element.close()
  if (element.open && hasScrim && isInteractive.value && switcher.isCoveredInTopLayer(props.sheetId))
    element.close()
  if (!element.open) {
    switcher.beforePresent(props.sheetId)
    if (!hasScrim)
      element.show()
    else if (ownsScrim.value)
      presentStepModally(element)
    else
      // 进场时下面那步的遮罩已经压暗了页面：带着透明遮罩呈现，页面不会被压暗两次。
      presentWithClearScrim(element)
  }
  dialogMode = nextMode
  switcher.afterStepSync(props.sheetId)
}

watch([isPresented, isInteractive, ownsScrim, () => switcher.hasScrim()], syncDialog, { flush: 'post' })

// 成为当前那步时把焦点送进面板；排在呈现之后，对话框已经开着。
let hasFocused = false
function syncFocus(interactive: boolean, wasInteractive: boolean): void {
  if (interactive) {
    if (!hasFocused || !wasInteractive)
      focusSheetPanel(panel.value?.element ?? null, 'open', switcher.hasScrim())
    hasFocused = true
  }
  else if (phase.value === 'hidden') {
    hasFocused = false
  }
}
watch(isInteractive, (interactive, wasInteractive) => syncFocus(interactive, wasInteractive), { flush: 'post' })

onMounted(() => {
  syncDialog()
  syncFocus(isInteractive.value, false)
})

onBeforeUnmount(() => {
  // 呈现着就被移除：趁还在文档里把对话框关掉，原生的生命周期干净地结束。
  if (dialog.value?.open)
    dialog.value.close()
  switcher.unregister(props.sheetId)
})

/** 切换器的 attrs 落到每一步的对话框上；标识一个元素的 `id`、`data-testid` 只在宿主那步上。 */
const dialogAttrs = computed(() => isHost.value ? { ...switcher.stepAttrs(), ...switcher.hostAttrs() } : switcher.stepAttrs())
const dialogLabel = computed(() => {
  const shared = dialogAttrs.value
  return (shared['aria-label'] as string | undefined) ?? (shared['aria-labelledby'] == null ? props.label : undefined)
})

const dialogRole = computed(() => props.purpose === 'required' ? 'alertdialog' : dialogAttrs.value.role as string | undefined)

function panelAttrs(): Record<string, unknown> {
  const { 'aria-label': _label, 'aria-labelledby': _labelledBy, ...rest } = attrs
  return rest
}

const scrimFade = { current: null as string | null }
function onScrimFade(fade: ScrimFade | null): void {
  writeScrimFade(dialog.value ?? null, fade, scrimFade)
}

function onDismiss(): void {
  if (props.purpose === 'info')
    switcher.requestClose(props.sheetId)
}

function onMotionStart(motion: BottomSheetPanelMotion): void {
  if (isPublicMotion(motion))
    emit('motionStart', motion)
  switcher.onMotionStart(props.sheetId, motion)
}

function onMotionComplete(motion: BottomSheetPanelMotion): void {
  if (isPublicMotion(motion))
    emit('motionComplete', motion)
  switcher.onMotionComplete(props.sheetId, motion)
}

defineExpose({ element: computed(() => panel.value?.element ?? null) })
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 点在 dialog 自身上等于点遮罩；键盘走原生 cancel 和下面的 keydown。 -->
  <dialog
    ref="dialog"
    v-bind="dialogAttrs"
    class="astryx-bottom-sheet-dialog astryx-bottom-sheet-switcher"
    :class="{
      'astryx-bottom-sheet-dialog--scrim': switcher.hasScrim(),
      'astryx-bottom-sheet-dialog--closing': switcher.hasScrim() && ownsScrim && switcher.isFlowClosing.value,
      'astryx-bottom-sheet-switcher--non-modal': !switcher.hasScrim(),
      'astryx-bottom-sheet-switcher--non-modal-top': !switcher.hasScrim() && isInteractive,
    }"
    :data-settled="isSettled || undefined"
    :aria-label="dialogLabel"
    :aria-modal="switcher.hasScrim() && isInteractive ? 'true' : undefined"
    :aria-hidden="isBlocked ? 'true' : undefined"
    :inert="isBlocked || undefined"
    :data-sheet-stack="switcher.hasScrim() && isPresented ? stackStateAttribute(switcher.stackView.value, switcher.activeId.value != null) : undefined"
    :data-sheet-stack-depth="switcher.hasScrim() && isPresented && switcher.stackView.value.depth > 0 ? switcher.stackView.value.depth : undefined"
    :role="dialogRole"
    @cancel="switcher.onCancel"
    @click="switcher.onClick"
    @keydown="switcher.onKeydown"
  >
    <div
      class="astryx-bottom-sheet__positioner"
      :class="[
        switcher.hasScrim() ? stackRecedeClasses(switcher.stackView.value) : undefined,
        { 'astryx-bottom-sheet__positioner--top': isInteractive },
      ]"
      :hidden="!isPresented || undefined"
      :aria-hidden="isBlocked ? 'true' : undefined"
      :inert="isBlocked || undefined"
    >
      <BottomSheetPanel
        ref="panel"
        v-bind="panelAttrs()"
        :state="panelState"
        :retained-motion="retainedMotion"
        :alignment-offset="switcher.alignmentOffsetOf(sheetId)"
        :label="label"
        :height="height"
        :padding="padding"
        :snap-points="snapPoints"
        :is-swipe-dismiss-allowed="purpose === 'info'"
        :is-page-scroll-locked="switcher.hasScrim()"
        @dismiss="onDismiss"
        @scrim-opacity="switcher.onScrimOpacity(sheetId, $event)"
        @scrim-fade="onScrimFade"
        @snap="emit('snap', $event)"
        @motion-start="onMotionStart"
        @motion-complete="onMotionComplete"
      >
        <slot />
      </BottomSheetPanel>
    </div>
    <div v-if="isPresented" class="astryx-bottom-sheet__edge-tint" aria-hidden="true" />
    <div ref="layerHost" class="astryx-bottom-sheet__layer-host" />
  </dialog>
</template>
