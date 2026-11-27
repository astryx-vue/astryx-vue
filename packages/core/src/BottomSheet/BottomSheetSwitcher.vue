<script setup lang="ts">
import type { DismissEscape } from '../layer/dismissStack.js'
import type { BottomSheetPanelMotion } from './panelState.js'
import type { BottomSheetSwitcherContext, BottomSheetSwitcherStep } from './switcher.js'
import type { BottomSheetPurpose } from './types.js'
import { computed, getCurrentInstance, inject, onMounted, provide, ref, shallowRef, useAttrs, useTemplateRef, watch } from 'vue'
import { useScrollLock } from '../composables/useScrollLock.js'
import { isImeKeyEvent } from '../utils/ime.js'
import { bottomSheetHostKey } from './sheetHostContext.js'
import { useModalOutletWhile } from './stack/useModalOutletWhile.js'
import { bottomSheetSwitcherKey } from './switcher.js'
import { useSwitcherStack } from './switcher/useSwitcherStack.js'
import { useSwitcherTransition } from './switcher/useSwitcherTransition.js'
import { useSheetLayerDismiss } from './useSheetLayerDismiss.js'
import '../../styles/bottom-sheet.css'

/**
 * 让一组 BottomSheet 同时最多只有一张是当前那步，每一步各有自己的原生 dialog。
 * 换步时上一步原地留着、不能操作，新的一步从下面升上来，上一步比它高时同时往下移到顶边对齐，
 * 两边都走完后上一步淡出。
 *
 * @deprecated Write each step as its own `BottomSheet` with `isOpen`, driven
 * by one state value that names the open step; closing the top sheet and opening the
 * next in the same update, from a control inside the open step, runs the same replace
 * handoff (see BottomSheet, "Replacing a sheet"). Keeps working until a future minor
 * release removes it.
 */
defineOptions({ name: 'AstryxBottomSheetSwitcher', inheritAttrs: false })

const props = withDefaults(defineProps<{
  /** 整段流程的无障碍名。不传时用当前那张底栏的 `label`。 */
  label?: string
  /**
   * 整段流程怎么被关掉。不传时跟当前那张底栏的 `purpose` 走。
   */
  purpose?: BottomSheetPurpose
  /**
   * 每一步是否以模态打开、带原生遮罩。换步时遮罩留着，直到流程关掉。
   * @default true
   */
  hasScrim?: boolean
}>(), {
  hasScrim: true,
})

const emit = defineEmits<{
  /**
   * 原生 dialog 收到取消请求时先发这个事件。调用 `event.preventDefault()`
   * 可以留住这段流程，不让它关掉。
   */
  cancel: [event: Event]
}>()

const activeSheet = defineModel<string | null>('activeSheet', { default: null })
const attrs = useAttrs()
const host = inject(bottomSheetHostKey, null)
const flow = useTemplateRef<HTMLElement>('flow')
// 写在另一张面板内容里的流程只在外面那张打开时呈现。挂载之前读成关着：服务端渲染出来的对话框
// 还没进原生宿主，不能带着 aria-modal 说自己是模态的。
const isMounted = ref(false)
const activeId = computed(() => isMounted.value && (host?.isOpen.value ?? true) ? activeSheet.value : null)
// 服务端渲染时就开着的那步，水合后直接静止呈现；换过一次步骤后恢复动效。
const settledId = ref(getCurrentInstance()?.vnode.el != null ? activeSheet.value : null)
const steps = shallowRef(new Map<string, BottomSheetSwitcherStep>())

function hasStep(id: string | null): id is string {
  return id != null && steps.value.has(id)
}

const transition = useSwitcherTransition({
  activeId,
  hasStep,
  getPanel: id => steps.value.get(id)?.getPanel() ?? null,
})

const presentedActive = computed(() => hasStep(activeId.value) ? activeId.value : null)
const presentedRetained = computed(() => hasStep(transition.retainedId.value) ? transition.retainedId.value : null)
const isFlowVisible = computed(() => presentedActive.value != null || presentedRetained.value != null)
const isFlowOpen = computed(() => activeId.value != null)
const isFlowClosing = computed(() => isFlowVisible.value && activeId.value == null)
// 宿主对话框（`id`、`data-testid`、浮层登记都在它上面）：当前那步的，流程退场时退场那步的，
// 流程关着时上次做宿主的那步的（没有就是第一步的）。
const lastHostId = ref<string | null>(null)
const presentedHost = computed(() => presentedActive.value ?? presentedRetained.value)
watch(presentedHost, (id) => {
  if (id != null)
    lastHostId.value = id
}, { flush: 'sync' })
const hostId = computed(() => presentedHost.value ?? (hasStep(lastHostId.value) ? lastHostId.value : (steps.value.keys().next().value ?? null)))
// 交接期间被留下的那步拿着遮罩，进场那步呈现在它上面也不会把它压暗。
const scrimOwnerId = computed(() => presentedRetained.value ?? presentedActive.value)
const flowPurpose = computed(() => props.purpose ?? (activeId.value == null ? undefined : steps.value.get(activeId.value)?.purpose()) ?? 'info')

const dialogOf = (id: string): HTMLDialogElement | null => steps.value.get(id)?.getDialog() ?? null
const hostDialog = (): HTMLDialogElement | null => hostId.value == null ? null : dialogOf(hostId.value)

const stack = useSwitcherStack({
  hasScrim: () => props.hasScrim,
  activeId,
  isFlowVisible,
  isFlowOpen,
  hostId,
  scrimOwnerId,
  dialogOf,
  panelOf: id => steps.value.get(id)?.getPanel() ?? null,
  stepIds: () => steps.value.keys(),
  getFlow: () => flow.value ?? null,
})
const stackView = stack.view

// 整段流程只锁一次滚动：交接时两个对话框都开着、退场期间也算。
useScrollLock(computed(() => props.hasScrim && isFlowVisible.value))
useModalOutletWhile(hostDialog, () => props.hasScrim && isFlowOpen.value && (stackView.value.isTop || !stackView.value.isStacked))

function requestCloseFlow(): void {
  if (flowPurpose.value === 'required')
    return
  activeSheet.value = null
}

const layerEscape = computed<DismissEscape>(() => {
  if (activeId.value == null || flowPurpose.value === 'required')
    return 'block'
  if (!props.hasScrim)
    return 'ignore'
  return 'close'
})
const layer = useSheetLayerDismiss({
  isActive: isFlowVisible,
  escape: layerEscape,
  getContainer: hostDialog,
  // 被别的面板盖住时让出按键，Escape 和平台的关闭请求交给最上面那张。
  isPresent: () => (hostDialog()?.open ?? false) && !stackView.value.isCovered,
  onDismiss: requestCloseFlow,
})

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || !layer.isTop())
    return
  event.preventDefault()
  if (isImeKeyEvent(event))
    return
  requestCloseFlow()
}

function onCancel(event: Event): void {
  // 内部元素也会发 cancel：文件选择器被取消时就会冒上来，那不是关闭请求。
  if (event.target !== event.currentTarget)
    return
  emit('cancel', event)
  // 原生 <dialog> 的 cancel 会自己关掉对话框，所以这里先拦下来；
  // 消费者已经 preventDefault 时视为不同意关闭。
  if (event.defaultPrevented)
    return
  event.preventDefault()
  if (!layer.isTop())
    return
  requestCloseFlow()
}

function onClick(event: MouseEvent): void {
  // 只有宿主那步的遮罩是流程的遮罩；被留下的那步 inert，藏起的关着，点不到，这里也明确排除。
  if (event.target !== event.currentTarget || event.currentTarget !== hostDialog())
    return
  if (props.hasScrim && flowPurpose.value === 'info')
    activeSheet.value = null
}

function onMotionStart(id: string, motion: BottomSheetPanelMotion): void {
  if (motion === 'entering')
    transition.onEnterStart(id)
}

function onMotionComplete(id: string, motion: BottomSheetPanelMotion): void {
  transition.onComplete(id, motion)
}

/** id 和 data-testid 只放在宿主对话框上；其它 attrs 落到每一步的对话框上。 */
const hostAttrs = computed(() => ({ 'id': attrs.id, 'data-testid': attrs['data-testid'] }))
const stepAttrs = computed(() => {
  const { 'id': _id, 'data-testid': _testId, ...rest } = attrs
  return { ...rest, 'aria-label': (attrs['aria-label'] as string | undefined) ?? props.label }
})

const context: BottomSheetSwitcherContext = {
  activeId,
  hasScrim: () => props.hasScrim,
  isFlowClosing,
  stackView,
  settledId,
  phaseOf: transition.phaseOf,
  alignmentOffsetOf: transition.alignmentOffsetOf,
  isHost: id => hostId.value === id,
  isScrimOwner: id => scrimOwnerId.value === id,
  stepAttrs: () => stepAttrs.value,
  hostAttrs: () => hostAttrs.value,
  register: (id, step) => {
    const next = new Map(steps.value)
    next.set(id, step)
    steps.value = next
  },
  unregister: (id) => {
    const next = new Map(steps.value)
    next.delete(id)
    steps.value = next
    transition.dropStep(id)
    stack.forgetStep(id)
  },
  beforePresent: stack.beforePresent,
  afterStepSync: stack.afterStepSync,
  isCoveredInTopLayer: stack.isCoveredInTopLayer,
  onMotionStart,
  onMotionComplete,
  onScrimOpacity: stack.onScrimOpacity,
  requestClose: (id) => {
    if (activeSheet.value === id)
      activeSheet.value = null
  },
  onCancel,
  onClick,
  onKeydown,
}
provide(bottomSheetSwitcherKey, context)

watch(activeSheet, (_id, previous) => {
  if (previous != null)
    settledId.value = null
})

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <div
    ref="flow"
    class="astryx-bottom-sheet-switcher-flow"
    :class="{ 'astryx-bottom-sheet-switcher-flow--non-modal': !hasScrim && isFlowVisible }"
  >
    <slot />
  </div>
</template>
