<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { LayerPlacement } from '../layer/position.js'
import type { MoreMenuInitialFocus, MoreMenuItem, MoreMenuPanelEmits, MoreMenuPanelProps, MoreMenuSection } from './types.js'
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, useId, useTemplateRef, watch } from 'vue'
import { useOverflow } from '../composables/useOverflow.js'
import Divider from '../Divider/Divider.vue'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { moreMenuLevelKey, useMoreMenuLevel, useMoreMenuSize } from './context.js'
import { isDividerOption, isSectionOption } from './menuItems.js'
import { isRtl, useMenuNav } from './menuNav.js'
import MoreMenuRow from './MoreMenuRow.vue'
import '../../styles/more-menu.css'
import '../../styles/layer.css'

defineOptions({ name: 'AstryxMoreMenuPanel' })

const props = withDefaults(defineProps<MoreMenuPanelProps>(), {
  alignment: 'start',
  anchor: null,
  ariaLabelledby: undefined,
  id: undefined,
  initialFocus: 'none',
  isInline: false,
  isNested: false,
  label: undefined,
  level: 0,
  placement: 'below',
})

const emit = defineEmits<MoreMenuPanelEmits>()

const size = useMoreMenuSize()
const parentLevel = useMoreMenuLevel()
const generatedId = `astryx-more-menu-panel-${useId()}`

const GAP = 4
const HOVER_CLOSE_DELAY = 250

const menuId = computed(() => props.id ?? generatedId)
const layer = useTemplateRef<HTMLElement>('layer')
const panel = useTemplateRef<HTMLElement>('panel')
const isPanelOpen = computed(() => props.isOpen)
const hasOverflow = useOverflow(panel, isPanelOpen)
useScrollbars(panel)
const openRowKey = ref<string | null>(null)
const renderedRowKey = ref<string | null>(null)
const flyoutFocus = ref<MoreMenuInitialFocus>('none')
const flyoutPlacement = ref<LayerPlacement>('end')
const rowElements = new Map<string, HTMLElement>()

/** A row as it is rendered: its data plus the identity it keeps while open. */
interface RowEntry {
  key: string
  item: MoreMenuItem
  rowId: string
}

type PanelEntry
  = | { kind: 'divider', key: string }
    | { kind: 'row', key: string, row: RowEntry }
    | { kind: 'section', key: string, section: MoreMenuSection, rows: RowEntry[] }

const entries = computed<PanelEntry[]>(() => {
  let position = 0

  function toRow(item: MoreMenuItem, index: number, prefix: string): RowEntry {
    const key = `${prefix}${item.id ?? index}`
    position += 1

    return { item, key, rowId: `${menuId.value}-row-${position}` }
  }

  return props.items.map((option, index) => {
    if (isDividerOption(option))
      return { key: `divider-${index}`, kind: 'divider' as const }

    if (isSectionOption(option)) {
      const key = `section-${option.id ?? index}`

      return {
        key,
        kind: 'section' as const,
        section: option,
        rows: option.items.map((item, itemIndex) => toRow(item, itemIndex, `${key}:`)),
      }
    }

    return { key: `item-${option.id ?? index}`, kind: 'row' as const, row: toRow(option, index, 'item-') }
  })
})

const renderedRow = computed<RowEntry | null>(() => {
  for (const entry of entries.value) {
    if (entry.kind === 'row' && entry.row.key === renderedRowKey.value)
      return entry.row

    if (entry.kind === 'section') {
      const row = entry.rows.find(candidate => candidate.key === renderedRowKey.value)
      if (row != null)
        return row
    }
  }

  return null
})

const isFlyoutOpen = computed(() => openRowKey.value != null && openRowKey.value === renderedRowKey.value)

let closeTimer: ReturnType<typeof setTimeout> | undefined

function clearCloseTimer(): void {
  clearTimeout(closeTimer)
  closeTimer = undefined
}

function registerRow(key: string, element: HTMLElement | null): void {
  if (element != null)
    rowElements.set(key, element)
  else
    rowElements.delete(key)
}

function openFlyout(key: string, options: { focusFirst?: boolean } = {}): void {
  clearCloseTimer()
  flyoutFocus.value = options.focusFirst === true ? 'first' : 'none'
  // A flyout opens on the logical end side, which mirrors under RTL.
  flyoutPlacement.value = isRtl(rowElements.get(key) ?? null) ? 'start' : 'end'
  renderedRowKey.value = key
  openRowKey.value = key
}

function closeFlyout(options: { restoreFocus?: boolean } = {}): void {
  const key = openRowKey.value
  if (key == null)
    return

  clearCloseTimer()
  openRowKey.value = null
  if (options.restoreFocus === true) {
    nextTick(() => {
      const element = rowElements.get(key)
      if (element != null)
        element.focus({ preventScroll: true })
    })
  }
}

function holdFlyout(): void {
  clearCloseTimer()
}

function releaseFlyout(): void {
  clearCloseTimer()
  closeTimer = setTimeout(closeFlyout, HOVER_CLOSE_DELAY)
}

function onFlyoutSettled(): void {
  if (openRowKey.value == null)
    renderedRowKey.value = null
}

provide(moreMenuLevelKey, {
  closeFlyout,
  holdFlyout,
  openFlyout,
  openRowKey,
  registerRow,
  releaseFlyout,
})

const nav = useMenuNav({
  menuRef: panel,
  onClose: (reason) => {
    // Tab leaves the menu for the page, which the trigger the close restores
    // focus to continues from. Escape stops at this level.
    if (reason === 'tab' || !props.isNested)
      emit('close')
    else
      emit('closeLevel')
  },
})

watch(openRowKey, (key) => {
  if (key != null)
    renderedRowKey.value = key
})

watch(() => props.isOpen, async (isOpen) => {
  if (!isOpen) {
    nav.resetTypeahead()
    openRowKey.value = null
    renderedRowKey.value = null
    return
  }

  const focus = props.initialFocus
  await nextTick()
  applyInitialFocus(focus)
}, { immediate: true })

function applyInitialFocus(focus: MoreMenuInitialFocus): void {
  if (focus === 'none')
    return

  if (focus === 'first' && nav.focusFirst())
    return

  if (focus === 'last' && nav.focusLast())
    return

  nav.focusContainer()
}

const anchor = computed(() => (props.isInline ? null : props.anchor ?? null))
const isLayerActive = ref(false)
const anchorWidth = ref(0)

const { position, detach } = usePositionedLayer({
  anchor,
  layer,
  isOpen: isLayerActive,
  placement: computed(() => props.placement),
  alignment: computed(() => props.alignment),
  gap: GAP,
})

const layerStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = { '--astryx-more-menu-level': String(props.level) }

  if (props.isInline)
    return style

  style.top = `${position.value.top}px`
  style.left = `${position.value.left}px`
  style['--_more-menu-anchor-inline-size'] = `${anchorWidth.value}px`

  return style
})

const resolvedPlacement = computed(() => (props.isInline ? undefined : position.value.placement))

watch(() => props.isOpen, (isOpen) => {
  isLayerActive.value = isOpen
})

onMounted(() => {
  if (props.isOpen)
    nextTick(() => { isLayerActive.value = true })
})

function syncAnchorWidth(): void {
  anchorWidth.value = props.isInline ? 0 : props.anchor?.getBoundingClientRect().width ?? 0
}

watch(() => [props.isOpen, props.anchor] as const, async ([isOpen]) => {
  if (!isOpen)
    return

  await nextTick()
  syncAnchorWidth()
}, { immediate: true })

onBeforeUnmount(() => {
  clearCloseTimer()
  detach()
})

function onKeydown(event: KeyboardEvent): void {
  // A flyout owns its own keys: Escape and the close arrow collapse this level
  // only and leave the menu that opened it standing.
  if (props.isNested === true) {
    const closeKey = isRtl(panel.value) ? 'ArrowRight' : 'ArrowLeft'
    if (event.key === 'Escape' || event.key === closeKey) {
      event.preventDefault()
      event.stopPropagation()
      emit('closeLevel')
      return
    }
  }

  nav.handleKeyDown(event)
}

function onPointerMove(event: PointerEvent): void {
  if (event.pointerType !== 'mouse')
    return

  const target = event.target
  if (!(target instanceof HTMLElement))
    return

  const row = target.closest<HTMLElement>('[data-astryx-menu-row]')
  if (row == null || panel.value?.contains(row) !== true || row.dataset.disabled != null)
    return

  // Only one row reads as highlighted: the pointer moves the single highlight
  // onto the row it is over, whether or not that row already holds focus.
  if (row !== document.activeElement)
    row.focus({ preventScroll: true })

  if (openRowKey.value != null && openRowKey.value !== row.dataset.astryxMenuRow)
    closeFlyout()
}

defineExpose({
  focusContainer: nav.focusContainer,
  focusFirst: nav.focusFirst,
  focusLast: nav.focusLast,
})
</script>

<template>
  <Teleport :disabled="isInline" to="body">
    <Transition appear name="astryx-more-menu" @after-leave="emit('settled')">
      <div
        v-if="isOpen"
        ref="layer"
        class="astryx-more-menu__layer"
        :class="{ 'astryx-more-menu__layer--inline': isInline, 'astryx-layer': !isInline }"
        :data-level="level"
        :data-placement="resolvedPlacement"
        :style="layerStyle"
        @pointerenter="parentLevel?.holdFlyout()"
        @pointerleave="parentLevel?.releaseFlyout()"
      >
        <div
          :id="menuId"
          ref="panel"
          class="astryx-more-menu__panel"
          data-astryx-more-menu-surface=""
          :data-overflow="hasOverflow || undefined"
          :data-size="size"
          :aria-label="ariaLabelledby == null ? label : undefined"
          :aria-labelledby="ariaLabelledby"
          role="menu"
          tabindex="-1"
          @keydown="onKeydown"
          @pointermove="onPointerMove"
        >
          <template v-for="entry in entries" :key="entry.key">
            <Divider
              v-if="entry.kind === 'divider'"
              class="astryx-more-menu__divider"
            />
            <div
              v-else-if="entry.kind === 'section'"
              :aria-label="entry.section.title"
              class="astryx-more-menu__group"
              role="group"
            >
              <div
                v-if="entry.section.title != null && entry.section.title !== ''"
                aria-hidden="true"
                class="astryx-more-menu__heading"
              >
                {{ entry.section.title }}
              </div>
              <MoreMenuRow
                v-for="row in entry.rows"
                :key="row.key"
                :item="row.item"
                :row-id="row.rowId"
                :row-key="row.key"
              />
            </div>
            <MoreMenuRow
              v-else
              :item="entry.row.item"
              :row-id="entry.row.rowId"
              :row-key="entry.row.key"
            />
          </template>
        </div>
        <Teleport to="body">
          <MoreMenuPanel
            v-if="renderedRow != null && renderedRow.item.items != null"
            :id="`${menuId}-flyout`"
            alignment="start"
            :anchor="rowElements.get(renderedRow.key) ?? null"
            :aria-labelledby="renderedRow.rowId"
            :initial-focus="flyoutFocus"
            :is-nested="true"
            :is-open="isFlyoutOpen"
            :items="renderedRow.item.items"
            :level="level + 1"
            :placement="flyoutPlacement"
            @close="emit('close')"
            @close-level="closeFlyout({ restoreFocus: true })"
            @settled="onFlyoutSettled"
          />
        </Teleport>
      </div>
    </Transition>
  </Teleport>
</template>
