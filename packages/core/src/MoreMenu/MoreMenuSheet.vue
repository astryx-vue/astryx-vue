<script setup lang="ts">
import type { MoreMenuItem, MoreMenuOption, MoreMenuSection, MoreMenuSheetEmits, MoreMenuSheetProps } from './types.js'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import Divider from '../Divider/Divider.vue'
import Heading from '../Heading/Heading.vue'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { focusElement, getFocusables } from '../layer/focus.js'
import List from '../List/List.vue'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { isDividerOption, isSectionOption } from './menuItems.js'
import MoreMenuSheetRow from './MoreMenuSheetRow.vue'
import '../../styles/more-menu.css'
import '../../styles/layer.css'

defineOptions({ name: 'AstryxMoreMenuSheet' })

const props = withDefaults(defineProps<MoreMenuSheetProps>(), {
  backLabel: 'Back',
  id: undefined,
  initialFocus: 'none',
})

const emit = defineEmits<MoreMenuSheetEmits>()

const ROW_CONTROL_SELECTOR = 'a[href], button:not([disabled])'

const sheet = useTemplateRef<HTMLElement>('sheet')
const sheetBody = useTemplateRef<HTMLElement>('sheetBody')
useScrollbars(sheetBody)
const path = ref<MoreMenuItem[]>([])
const drilledRowIds = ref<string[]>([])

const currentItems = computed<MoreMenuOption[]>(() => path.value.at(-1)?.items ?? props.items)
const title = computed(() => {
  const view = path.value.at(-1)

  return view != null && view.label !== '' ? view.label : props.label
})

interface SheetRow {
  key: string
  rowId: string
  item: MoreMenuItem
}

type SheetEntry
  = | { kind: 'divider', key: string }
    | { kind: 'row', key: string, row: SheetRow }
    | { kind: 'section', key: string, section: MoreMenuSection, rows: SheetRow[] }

const entries = computed<SheetEntry[]>(() => {
  const view = path.value.length

  function toRow(item: MoreMenuItem, index: number, prefix: string): SheetRow {
    const key = `${prefix}${item.id ?? index}`

    return { item, key, rowId: `view-${view}-${key}` }
  }

  return currentItems.value.map((option, index) => {
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

function rowControls(): HTMLElement[] {
  const element = sheet.value
  if (element == null)
    return []

  return Array.from(element.querySelectorAll<HTMLElement>(`.astryx-more-menu__sheet-list ${ROW_CONTROL_SELECTOR}`))
}

function focusHeading(): void {
  const heading = sheet.value?.querySelector<HTMLElement>('.astryx-more-menu__sheet-title')
  if (heading != null)
    focusElement(heading)
}

function applyInitialFocus(focus: MoreMenuSheetProps['initialFocus']): void {
  if (focus === 'none')
    return

  if (focus !== 'container') {
    const controls = rowControls()
    const control = focus === 'last' ? controls[controls.length - 1] : controls[0]
    if (control != null && focusElement(control))
      return
  }

  if (sheet.value != null)
    focusElement(sheet.value)
}

watch(() => props.isOpen, async (isOpen) => {
  if (!isOpen) {
    path.value = []
    drilledRowIds.value = []
    return
  }

  const focus = props.initialFocus
  await nextTick()
  applyInitialFocus(focus)
}, { immediate: true })

function pushView(item: MoreMenuItem, rowId: string): void {
  drilledRowIds.value = [...drilledRowIds.value, rowId]
  path.value = [...path.value, item]
  void nextTick(focusHeading)
}

function popView(): void {
  const rowId = drilledRowIds.value.at(-1)
  drilledRowIds.value = drilledRowIds.value.slice(0, -1)
  path.value = path.value.slice(0, -1)

  if (rowId == null) {
    void nextTick(focusHeading)
    return
  }

  void nextTick(() => {
    // The row that drilled in is rendered again now that its view is back, so
    // it is found by the identity it had at that depth.
    const row = sheet.value?.querySelector<HTMLElement>(`[data-astryx-sheet-row="${rowId}"]`)
    const control = row?.querySelector<HTMLElement>(ROW_CONTROL_SELECTOR)
    if (control != null && focusElement(control))
      return

    focusHeading()
  })
}

function onSelect(item: MoreMenuItem, event: MouseEvent): void {
  if (item.isDisabled)
    return

  item.onClick?.(event)
  if (item.hasCloseOnSelect !== false)
    emit('close')
}

function onScrimClick(): void {
  emit('close')
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    // The sheet owns Escape: a drilled-in view collapses to the view that
    // opened it, and only the root view closes the menu.
    event.stopPropagation()
    if (path.value.length > 0)
      popView()
    else
      emit('close')
    return
  }

  if (event.key !== 'Tab')
    return

  const element = sheet.value
  if (element == null)
    return

  const focusables = getFocusables(element)
  if (focusables.length === 0) {
    event.preventDefault()
    return
  }

  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  const active = element.ownerDocument.activeElement

  if (active == null || !element.contains(active)) {
    event.preventDefault()
    focusElement(event.shiftKey ? last : first)
    return
  }

  if (event.shiftKey && (active === first || active === element)) {
    event.preventDefault()
    focusElement(last)
  }
  else if (!event.shiftKey && active === last) {
    event.preventDefault()
    focusElement(first)
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition appear name="astryx-more-menu-sheet">
      <div v-if="isOpen" class="astryx-more-menu__sheet-layer astryx-layer">
        <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 按下遮罩关闭是纯指针的快捷方式；键盘用户走对话框自身的 Escape 路径。 -->
        <div class="astryx-more-menu__scrim" @click="onScrimClick" />
        <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 对话框面板自己处理 Escape 与焦点循环；面板本身不参与读屏的交互控件序列。 -->
        <div
          :id="id"
          ref="sheet"
          aria-modal="true"
          class="astryx-more-menu__sheet"
          data-astryx-more-menu-surface=""
          role="dialog"
          :aria-label="title"
          :tabindex="-1"
          @keydown="onKeydown"
        >
          <div class="astryx-more-menu__sheet-header">
            <IconButton
              v-if="path.length > 0"
              class="astryx-more-menu__sheet-back"
              :label="backLabel"
              size="sm"
              variant="ghost"
              @click="popView"
            >
              <Icon class="astryx-more-menu__sheet-back-icon" icon="chevronLeft" size="sm" />
            </IconButton>
            <Heading
              class="astryx-more-menu__sheet-title"
              :level="3"
              :tabindex="-1"
            >
              {{ title }}
            </Heading>
          </div>
          <div ref="sheetBody" class="astryx-more-menu__sheet-body">
            <List class="astryx-more-menu__sheet-list" density="spacious">
              <template v-for="entry in entries" :key="entry.key">
                <li
                  v-if="entry.kind === 'divider'"
                  class="astryx-more-menu__sheet-divider"
                  role="presentation"
                >
                  <Divider />
                </li>
                <li
                  v-else-if="entry.kind === 'section'"
                  class="astryx-more-menu__sheet-group"
                  role="presentation"
                >
                  <div
                    :aria-label="entry.section.title"
                    role="group"
                  >
                    <Heading
                      v-if="entry.section.title != null && entry.section.title !== ''"
                      class="astryx-more-menu__sheet-heading"
                      :level="4"
                    >
                      {{ entry.section.title }}
                    </Heading>
                    <List density="spacious">
                      <MoreMenuSheetRow
                        v-for="row in entry.rows"
                        :key="row.key"
                        :item="row.item"
                        :row-id="row.rowId"
                        @drill-in="pushView"
                        @select="onSelect"
                      />
                    </List>
                  </div>
                </li>
                <MoreMenuSheetRow
                  v-else
                  :item="entry.row.item"
                  :row-id="entry.row.rowId"
                  @drill-in="pushView"
                  @select="onSelect"
                />
              </template>
            </List>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
