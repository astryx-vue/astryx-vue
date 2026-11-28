<script setup lang="ts">
import type { PaginationDensity } from '../composables/usePagination.js'
import type { SelectorOption } from '../Selector/types.js'
import type { PaginationEmits, PaginationProps, PaginationSlots, PaginationVariant } from './types.js'
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useFocusAcrossSwap } from '../composables/internal/focusAcrossSwap.js'
import { focusForLastInput } from '../composables/internal/focusReturn.js'
import { useListFocus } from '../composables/useListFocus.js'
import { paginationDensityForWidth, siblingCountForDensity, usePagination } from '../composables/usePagination.js'
import { usePendingChange } from '../composables/usePendingChange.js'
import { useComponentMessages } from '../locale/context.js'
import { paginationMessages } from '../locale/messages/pagination.js'
import NumberInput from '../NumberInput/NumberInput.vue'
import Selector from '../Selector/Selector.vue'
import { consumeWhileDisabled } from '../utils/disabledInteraction.js'
import { usePaginationLinks } from './usePaginationLinks.js'
import '../../styles/pagination.css'

defineOptions({ name: 'AstryxPagination' })

const props = withDefaults(defineProps<PaginationProps>(), {
  page: 1,
  pageSize: 10,
  total: 0,
  variant: 'pages',
  size: 'md',
  showSizeChanger: false,
  pageSizeOptions: () => [10, 20, 50, 100],
  showTotal: false,
  disabled: false,
  isDisabled: false,
  step: 1,
  hasFirstLast: null,
})

const emit = defineEmits<PaginationEmits>()
defineSlots<PaginationSlots>()

const messages = useComponentMessages({ pagination: paginationMessages })
const disabledControl = computed(() => props.isDisabled || props.disabled)
const regionLabel = computed(() => props.label ?? messages.value.pagination.nav)
const stride = computed(() => Number.isInteger(props.step) && props.step >= 1 ? props.step : 1)
const resolvedPrevLabel = computed(() => props.prevLabel ?? (stride.value > 1 ? messages.value.pagination.previousBy(stride.value) : messages.value.pagination.previous))
const resolvedNextLabel = computed(() => props.nextLabel ?? (stride.value > 1 ? messages.value.pagination.nextBy(stride.value) : messages.value.pagination.next))
const resolvedPageSizeLabel = computed(() => props.pageSizeLabel ?? messages.value.pagination.perPage)
const resolvedPageLabel = computed(() => props.pageLabel ?? messages.value.pagination.pageLabel)
const pending = usePendingChange(() => props.changeAction)

function resolvedItemTotal(): number {
  if (props.totalItems != null && props.totalItems > 0)
    return props.totalItems
  if (props.total > 0)
    return props.total
  if (props.totalPages != null && props.totalPages > 0)
    return props.totalPages * props.pageSize
  return props.total
}

const pageRef = ref(props.page)
const pageSizeRef = ref(props.pageSize)
const totalRef = ref(resolvedItemTotal())
const variant = computed<PaginationVariant>(() => props.variant)
const root = ref<HTMLElement | null>(null)
const density = ref<PaginationDensity>('full')
const siblingCount = computed(() => {
  if (density.value !== 'full')
    return siblingCountForDensity(density.value)
  return props.siblingCount ?? 1
})
let resizeObserver: ResizeObserver | undefined

function applyContainerWidth(width: number): void {
  density.value = paginationDensityForWidth(width)
}

onMounted(() => {
  const element = root.value
  if (!element || typeof ResizeObserver === 'undefined')
    return

  resizeObserver = new ResizeObserver((entries) => {
    applyContainerWidth(entries[0]?.contentRect.width ?? 0)
  })
  resizeObserver.observe(element)
  applyContainerWidth(element.getBoundingClientRect().width)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

const pagination = usePagination({
  page: pageRef,
  pageSize: pageSizeRef,
  total: totalRef,
  siblingCount,
  step: stride,
  hasMore: computed(() => props.hasMore),
  onPageChange: (page) => {
    pageRef.value = page
    emit('update:page', page)
    emit('change', page, pageSizeRef.value)
    void pending.run(page)
  },
  onPageSizeChange: (size) => {
    pageSizeRef.value = size
    emit('update:pageSize', size)
    emit('pageSizeChange', size)
    // A new page length restarts the list from the first page.
    pageRef.value = 1
    emit('update:page', 1)
    emit('change', 1, size)
    void pending.run(1)
  },
})

// 调用方显式设过每页条数时，才把它交给 getPageHref。
const instance = getCurrentInstance()
function setsPageSize(): boolean {
  const given = instance?.vnode.props
  return given != null && ['pageSize', 'page-size', 'pageSizeOptions', 'page-size-options'].some(key => key in given)
}

const links = usePaginationLinks({
  getPageHref: () => props.getPageHref,
  as: () => props.as,
  page: pageRef,
  pageSize: () => setsPageSize() ? pageSizeRef.value : undefined,
  step: stride,
  totalPages: pagination.totalPages,
  isCursor: pagination.isCursor,
  isAvailable: (kind) => {
    if (disabledControl.value)
      return false
    if (kind === 'first' || kind === 'previous')
      return pagination.canPrevious.value
    if (kind === 'next')
      return pagination.canNext.value
    return !pagination.isCursor.value && pagination.canNext.value
  },
})
const firstHref = computed(() => links.controlHref('first'))
const previousHref = computed(() => links.controlHref('previous'))
const nextHref = computed(() => links.controlHref('next'))
const lastHref = computed(() => links.controlHref('last'))

// 控件在链接和按钮之间切换时（到了边界、被禁用），带着焦点的那个控件把焦点交给新元素。
useFocusAcrossSwap(() => root.value, '.astryx-pagination-first', () => firstHref.value != null)
useFocusAcrossSwap(() => root.value, '.astryx-pagination-prev', () => previousHref.value != null)
useFocusAcrossSwap(() => root.value, '.astryx-pagination-next', () => nextHref.value != null)
useFocusAcrossSwap(() => root.value, '.astryx-pagination-last', () => lastHref.value != null)

// 同步外部 props
function syncFromProps(): void {
  pageRef.value = props.page
  pageSizeRef.value = props.pageSize
  totalRef.value = resolvedItemTotal()
}

syncFromProps()

watch(() => props.page, (page) => {
  if (page !== pageRef.value)
    pageRef.value = page
})

watch(() => props.pageSize, (pageSize) => {
  if (pageSize !== pageSizeRef.value)
    pageSizeRef.value = pageSize
})

watch(() => [props.total, props.totalItems, props.totalPages, props.pageSize] as const, () => {
  totalRef.value = resolvedItemTotal()
})

const showFirstLast = computed(() => {
  if (pagination.isCursor.value)
    return false
  // input shows them unless told otherwise; compact opts in; other variants never render them.
  const enabled = props.variant === 'input'
    ? (props.hasFirstLast ?? true)
    : props.variant === 'compact' && props.hasFirstLast === true
  return enabled && pagination.totalPages.value > 1
})

function onInputCommit(value: number | null): void {
  if (value == null || !Number.isFinite(value))
    return
  pagination.goto(Math.trunc(value))
}

/** 页码框正留着一个被拒的输入：框要变宽，装得下文字旁边的状态图标。 */
const isPageEntryRejected = shallowRef(false)
const pageBoxWidth = computed(() => {
  const width = `var(--astryx-size-element-${props.size === 'sm' ? 'sm' : 'md'}, ${props.size === 'sm' ? 28 : 36}px)`
  return isPageEntryRejected.value ? `calc(${width} + var(--astryx-spacing-10, 40px))` : width
})

const pageSizeOptions = computed<SelectorOption[]>(() => {
  return props.pageSizeOptions.map(size => ({
    value: size,
    label: messages.value.pagination.pageSize(size),
  }))
})

const fromIndex = computed(() => {
  return (pageRef.value - 1) * pageSizeRef.value + 1
})

const toIndex = computed(() => {
  return Math.min(pageRef.value * pageSizeRef.value, totalRef.value)
})

function isEllipsis(page: number): boolean {
  return page === -1
}

function pageLinkHref(page: number): string | undefined {
  return isEllipsis(page) ? undefined : links.pageHref(page, disabledControl.value)
}

function onPageClick(page: number): void {
  if (!disabledControl.value && !isEllipsis(page)) {
    pagination.goto(page)
  }
}

const dotsFocus = useListFocus({
  itemSelector: 'button',
  hasRovingTabIndex: true,
  wrap: true,
  orientation: 'horizontal',
})

function setDotsList(element: unknown): void {
  dotsFocus.listRef.value = element as HTMLElement | null
}

function onDotsFocus(event: FocusEvent): void {
  dotsFocus.handleFocus(event)
  if (disabledControl.value)
    return
  const target = event.target instanceof Element
    ? event.target.closest<HTMLButtonElement>('button[data-page]')
    : null
  const page = Number(target?.dataset.page)
  if (Number.isInteger(page) && page > 0 && page !== pageRef.value)
    onPageClick(page)
}

function onDotClick(event: MouseEvent): void {
  // 换页统一由聚焦处理；按下时不聚焦（按下不该先选页，滑出去还能取消），所以松开的点击来聚焦，
  // 焦点环跟着上一次输入走。
  focusForLastInput(event.currentTarget as HTMLButtonElement)
  consumeWhileDisabled(event, disabledControl.value)
}
</script>

<template>
  <nav
    ref="root"
    class="astryx-pagination"
    :class="{
      'is-disabled': disabledControl,
      'astryx-pagination--sm': props.size === 'sm',
    }"
    :data-density="density"
    :data-variant="variant"
    :data-size="props.size"
    role="navigation"
    :aria-label="regionLabel"
    :aria-busy="pending.busy.value || undefined"
  >
    <div v-if="props.showTotal" class="astryx-pagination-total">
      <slot name="total" :total="totalRef" :from="fromIndex" :to="toIndex">
        {{ messages.pagination.total(totalRef, fromIndex, toIndex) }}
      </slot>
    </div>

    <div class="astryx-pagination-content astryx-pagination-list" :data-variant="variant" :data-size="props.size">
      <component
        :is="links.root(firstHref)"
        v-if="showFirstLast"
        v-bind="links.attrs(firstHref)"
        class="astryx-pagination-button astryx-pagination-item astryx-pagination-first"
        data-first="first"
        :disabled="firstHref ? undefined : disabledControl || !pagination.canPrevious.value"
        :aria-label="messages.pagination.first"
        @click="links.activate($event, firstHref, pagination.first)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M11 12L7 8L11 4M7 12L3 8L7 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </component>

      <component
        :is="links.root(previousHref)"
        v-bind="links.attrs(previousHref)"
        class="astryx-pagination-button astryx-pagination-item astryx-pagination-prev"
        :data-first="showFirstLast ? undefined : 'first'"
        :disabled="previousHref ? undefined : disabledControl || !pagination.canPrevious.value"
        :aria-label="resolvedPrevLabel"
        @click="links.activate($event, previousHref, pagination.previous)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="astryx-pagination-label" aria-hidden="true">{{ resolvedPrevLabel }}</span>
      </component>

      <span v-if="variant === 'input'" class="astryx-pagination-input">
        <span class="astryx-pagination-input-label" aria-hidden="true">{{ resolvedPageLabel }}</span>
        <!-- 说明收进状态图标（tooltip），被拒的输入留着也不会把页码条撑高；这里的输入时机自己管，所以显式写 complete。 -->
        <NumberInput
          :label="messages.pagination.goToPage"
          is-label-hidden
          :model-value="pageRef"
          :min="1"
          :max="pagination.isCursor.value ? undefined : pagination.totalPages.value"
          is-integer-only
          :size="props.size"
          :width="pageBoxWidth"
          :is-disabled="disabledControl || pagination.isCursor.value"
          entry-error-behavior="complete"
          status-variant="tooltip"
          @change="onInputCommit"
          @entry-error-change="isPageEntryRejected = $event != null"
        />
        <span v-if="!pagination.isCursor.value" class="astryx-pagination-input-total">{{ messages.pagination.ofTotal(pagination.totalPages.value) }}</span>
      </span>

      <span v-else-if="variant === 'count' && !pagination.isCursor.value" class="astryx-pagination-count">
        {{ messages.pagination.total(totalRef, fromIndex, toIndex) }}
      </span>

      <span v-else-if="variant === 'compact' && !pagination.isCursor.value" class="astryx-pagination-count">
        {{ messages.pagination.pageOf(pageRef, pagination.totalPages.value) }}
      </span>

      <div
        v-else-if="variant === 'dots' && !pagination.isCursor.value"
        :ref="setDotsList"
        class="astryx-pagination-dots"
        role="radiogroup"
        :aria-label="messages.pagination.nav"
        @focusin="onDotsFocus"
        @keydown="dotsFocus.handleKeyDown"
      >
        <button
          v-for="dotPage in pagination.totalPages.value"
          :key="dotPage"
          type="button"
          role="radio"
          class="astryx-pagination-dot"
          :class="{ 'is-active': dotPage === pageRef }"
          :data-page="dotPage"
          :tabindex="dotPage === pageRef ? 0 : -1"
          :aria-disabled="disabledControl || undefined"
          :aria-checked="dotPage === pageRef"
          :aria-label="messages.pagination.page(dotPage)"
          @mousedown.prevent
          @click="onDotClick"
          @keydown="consumeWhileDisabled($event, disabledControl)"
        />
      </div>

      <span
        v-if="variant === 'pages' && !pagination.isCursor.value"
        class="astryx-pagination-compact"
        :aria-hidden="density === 'minimal' ? undefined : true"
      >
        {{ messages.pagination.compact(pageRef, pagination.totalPages.value) }}
      </span>

      <div v-if="variant === 'pages' && !pagination.isCursor.value" v-show="density !== 'minimal'" class="astryx-pagination-pages">
        <component
          :is="links.root(pageLinkHref(page))"
          v-for="(page, index) in pagination.pageNumbers.value"
          :key="index"
          v-bind="links.attrs(pageLinkHref(page))"
          class="astryx-pagination-page"
          :class="{
            'is-active': page === pageRef,
            'is-ellipsis': isEllipsis(page),
            'astryx-pagination-item': !isEllipsis(page),
            'astryx-pagination-ellipsis': isEllipsis(page),
          }"
          :data-selected="!isEllipsis(page) && page === pageRef ? 'selected' : undefined"
          :disabled="pageLinkHref(page) ? undefined : disabledControl || isEllipsis(page)"
          :aria-label="isEllipsis(page) ? messages.pagination.more : messages.pagination.page(page)"
          :aria-current="page === pageRef ? 'page' : undefined"
          @click="links.activate($event, pageLinkHref(page), () => onPageClick(page))"
        >
          {{ isEllipsis(page) ? '...' : page }}
        </component>
      </div>

      <component
        :is="links.root(nextHref)"
        v-bind="links.attrs(nextHref)"
        class="astryx-pagination-button astryx-pagination-item astryx-pagination-next"
        :data-last="showFirstLast ? undefined : 'last'"
        :disabled="nextHref ? undefined : disabledControl || !pagination.canNext.value"
        :aria-label="resolvedNextLabel"
        @click="links.activate($event, nextHref, pagination.next)"
      >
        <span class="astryx-pagination-label" aria-hidden="true">{{ resolvedNextLabel }}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </component>

      <component
        :is="links.root(lastHref)"
        v-if="showFirstLast"
        v-bind="links.attrs(lastHref)"
        class="astryx-pagination-button astryx-pagination-item astryx-pagination-last"
        data-last="last"
        :disabled="lastHref ? undefined : disabledControl || !pagination.canNext.value"
        :aria-label="messages.pagination.last"
        @click="links.activate($event, lastHref, pagination.last)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M5 4L9 8L5 12M9 4L13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </component>

      <div v-if="props.showSizeChanger" class="astryx-pagination-size-changer">
        <span class="astryx-pagination-size-label">{{ resolvedPageSizeLabel }}</span>
        <Selector
          :model-value="pageSizeRef"
          :options="pageSizeOptions"
          :disabled="disabledControl"
          size="sm"
          @update:model-value="(size: string | number | null) => size && pagination.setPageSize(Number(size))"
        />
      </div>
    </div>
  </nav>
</template>
