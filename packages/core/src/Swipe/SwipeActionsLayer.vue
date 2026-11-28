<script setup lang="ts">
/**
 * 有横滑操作的行的横滑那一半：两侧的面板，渲染进行自己的根里，以及驱动这个根的手势。
 *
 * 行的根还是行的：它带上横滑的根样式（`astryx-item--swipe`），并把按键事件转给这一层暴露的
 * `onKeyDown`。手势挂在根本身上，行开着时这一层按住根的按压。这一层把两个面板渲染成根的
 * 脱离文档流的子元素，所以行里不为横滑多包任何元素。
 *
 * 一个面板是两个盒子加操作本身，都由读根上位移的 transform 移动（见 useSwipeAction）。
 * 窗口盖在行的静止盒子上、读位移的相反数，裁到那个盒子。窗口里的轨道跟着行走，把操作裁到行
 * 空出来的地方。每个操作从这一侧的钉位往回平移，所以在行把它们全露出来之前一直贴在外缘，之后
 * 跟着行走。过了开宽，画在最外侧操作旁边的同色块把剩下的地方一直填到外缘；确认的全滑里它滑到
 * 行边。某个操作盖满面板时，轨道铺满它的颜色、别的操作隐藏，所以操作的颜色不会在别的操作后面
 * 或中间露出来。
 */
import type { ShallowRef } from 'vue'
import type { SwipeEntry } from './swipeHost'
import type { SwipeReleaseBehavior, SwipeSide } from './swipeRelease'
import { computed, shallowRef, watch } from 'vue'
import { disabledInteractionProps } from '../utils/disabledInteraction'
import { isSwipeOpen } from './swipeRelease'
import { useSwipeAction } from './useSwipeAction'

defineOptions({ name: 'AstryxSwipeActionsLayer' })

const props = defineProps<{
  leading: ReadonlyArray<SwipeEntry>
  trailing: ReadonlyArray<SwipeEntry>
  behavior: SwipeReleaseBehavior
  itemKey?: string | number
}>()

const windows: Record<SwipeSide, ShallowRef<HTMLElement | null>> = {
  leading: shallowRef(null),
  trailing: shallowRef(null),
}
/** 行根：面板窗口的父元素。 */
const root = computed(() => (windows.leading.value ?? windows.trailing.value)?.parentElement ?? null)

function entriesOf(side: SwipeSide): ReadonlyArray<SwipeEntry> {
  return side === 'leading' ? props.leading : props.trailing
}

function outermostOf(side: SwipeSide): SwipeEntry | undefined {
  return entriesOf(side).at(-1)
}

function fire(entry: SwipeEntry): void {
  void entry.onActivate({ id: entry.id ?? '', itemKey: props.itemKey })
}

const swipe = useSwipeAction(() => root.value, () => ({
  behavior: props.behavior,
  sides: { leading: props.leading.length, trailing: props.trailing.length },
  // 禁用的最外侧操作不能触发，全滑也就永远不会朝它确认。
  canConfirm: side => outermostOf(side) != null && outermostOf(side)?.isDisabled !== true,
  fireOutermost: (side) => {
    const entry = outermostOf(side)
    if (entry == null || entry.isDisabled === true)
      return false
    fire(entry)
    return entry.hasRemoval === true
  },
}))

// id 相同的新值让行保持原样；id 变了露出的是别的操作，开着的行合上。
const idsKey = computed(() => {
  const ids = (entries: ReadonlyArray<SwipeEntry>): string => entries.map(entry => entry.id ?? '').join('\u0000')
  return `${ids(props.leading)}\u0001${ids(props.trailing)}`
})
watch(idsKey, () => swipe.close())

// 从让行停开的那次松手起就算开着（和 UIKit 一样）：行弹开途中手指看得见的操作就能点。
const isOpen = computed(() => isSwipeOpen(swipe.state.value))
const isCommit = computed(() => props.behavior === 'commit')

const sides = computed(() => (['leading', 'trailing'] as const)
  .map(side => ({ side, entries: entriesOf(side) }))
  .filter(({ entries }) => entries.length > 0))

/** 盖满这一侧面板的操作的序号；没有就是 null。 */
function coverIndex(side: SwipeSide, count: number): number | null {
  const { cover } = swipe.state.value
  return swipe.state.value.side === side && cover != null && cover < count ? cover : null
}

/** 面板只在行开在它这一侧时进入无障碍树和 Tab 顺序，所以行只有一个 Tab 停靠点。 */
function isLive(side: SwipeSide): boolean {
  return isOpen.value && swipe.state.value.side === side && !isCommit.value
}

function trackFill(side: SwipeSide, entries: ReadonlyArray<SwipeEntry>): string {
  const index = coverIndex(side, entries.length)
  return (index != null ? entries[index] : entries.at(-1))?.variant ?? 'accent'
}

function entryClass(side: SwipeSide, entries: ReadonlyArray<SwipeEntry>, index: number): Record<string, boolean> {
  const cover = coverIndex(side, entries.length)
  return {
    'astryx-item__swipe-entry--covered': cover != null && index !== cover,
    'astryx-item__swipe-entry--outer': index === entries.length - 1,
  }
}

function activate(entry: SwipeEntry, index: number): void {
  swipe.activateEntry(() => fire(entry), entry.hasRemoval === true, index)
}

function setWindow(side: SwipeSide, element: unknown): void {
  windows[side].value = element instanceof HTMLElement ? element : null
}

defineExpose({ onKeyDown: swipe.onKeyDown, state: swipe.state })
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/no-aria-hidden-on-focusable -- commit 下窗口始终 inert，里面的操作只是展示，不可聚焦。 -->
  <div
    v-for="{ side, entries } in sides"
    :key="side"
    :ref="element => setWindow(side, element)"
    class="astryx-item__swipe-window"
    :data-swipe-panel="side"
    :inert="isLive(side) ? undefined : true"
    :aria-hidden="isCommit ? true : undefined"
  >
    <div
      class="astryx-item__swipe-track astryx-item-swipe-panel"
      :data-side="side"
      :data-covered="coverIndex(side, entries.length) != null || undefined"
      :data-fill="trackFill(side, entries)"
    >
      <template v-for="(entry, index) in entries" :key="entry.id ?? entry.label">
        <span
          v-if="isCommit"
          class="astryx-item__swipe-entry astryx-item-swipe-action"
          :class="entryClass(side, entries, index)"
          :data-variant="entry.variant ?? 'accent'"
          :data-disabled="entry.isDisabled || undefined"
        >
          <component :is="entry.icon" v-if="entry.icon" aria-hidden="true" />
          <span>{{ entry.label }}</span>
        </span>
        <button
          v-else
          type="button"
          class="astryx-item__swipe-entry astryx-item-swipe-action"
          :class="entryClass(side, entries, index)"
          :data-variant="entry.variant ?? 'accent'"
          :data-disabled="entry.isDisabled || undefined"
          :aria-disabled="entry.isDisabled || undefined"
          v-bind="entry.isDisabled ? disabledInteractionProps() : {}"
          @click.stop="entry.isDisabled ? undefined : activate(entry, index)"
        >
          <component :is="entry.icon" v-if="entry.icon" aria-hidden="true" />
          <span>{{ entry.label }}</span>
        </button>
      </template>
    </div>
  </div>
</template>
