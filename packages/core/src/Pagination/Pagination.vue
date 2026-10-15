<script setup lang="ts">
import type { PaginationDensity } from '../composables/usePagination.js'
import type { SelectorOption } from '../Selector/types.js'
import type { PaginationEmits, PaginationProps, PaginationSlots, PaginationVariant } from './types.js'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { paginationDensityForWidth, siblingCountForDensity, usePagination } from '../composables/usePagination.js'
import { usePendingChange } from '../composables/usePendingChange.js'
import { useAstryxMessages } from '../locale/index.js'
import Selector from '../Selector/Selector.vue'
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
  step: 1,
  hasFirstLast: null,
})

const emit = defineEmits<PaginationEmits>()
defineSlots<PaginationSlots>()

const messages = useAstryxMessages()
const stride = computed(() => Number.isInteger(props.step) && props.step >= 1 ? props.step : 1)
const resolvedPrevLabel = computed(() => props.prevLabel ?? (stride.value > 1 ? messages.value.pagination.previousBy(stride.value) : messages.value.pagination.previous))
const resolvedNextLabel = computed(() => props.nextLabel ?? (stride.value > 1 ? messages.value.pagination.nextBy(stride.value) : messages.value.pagination.next))
const resolvedPageSizeLabel = computed(() => props.pageSizeLabel ?? messages.value.pagination.perPage)
const resolvedPageLabel = computed(() => props.pageLabel ?? messages.value.pagination.pageLabel)
const pending = usePendingChange(() => props.changeAction)

function resolvedItemTotal(): number {
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
    emit('change', pageRef.value, size)
  },
})

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

watch(() => [props.total, props.totalPages, props.pageSize] as const, () => {
  totalRef.value = resolvedItemTotal()
})

const showFirstLast = computed(() => {
  if (pagination.isCursor.value)
    return false
  const enabled = props.hasFirstLast ?? props.variant === 'input'
  return enabled && pagination.totalPages.value > 1
})

function onInputCommit(event: Event): void {
  const raw = Number((event.target as HTMLInputElement).value)
  if (!Number.isFinite(raw))
    return
  pagination.goto(Math.trunc(raw))
}

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

function onPageClick(page: number): void {
  if (!props.disabled && !isEllipsis(page)) {
    pagination.goto(page)
  }
}
</script>

<template>
  <nav
    ref="root"
    class="astryx-pagination"
    :class="{
      'is-disabled': props.disabled,
      'astryx-pagination--sm': props.size === 'sm',
    }"
    :data-density="density"
    :data-variant="variant"
    :data-size="props.size"
    role="navigation"
    :aria-label="messages.pagination.nav"
    :aria-busy="pending.busy.value || undefined"
  >
    <div v-if="props.showTotal" class="astryx-pagination-total">
      <slot name="total" :total="totalRef" :from="fromIndex" :to="toIndex">
        {{ messages.pagination.total(totalRef, fromIndex, toIndex) }}
      </slot>
    </div>

    <div class="astryx-pagination-content">
      <button
        v-if="showFirstLast"
        type="button"
        class="astryx-pagination-button astryx-pagination-first"
        :disabled="props.disabled || !pagination.canPrevious.value"
        :aria-label="messages.pagination.first"
        @click="pagination.first"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M11 12L7 8L11 4M7 12L3 8L7 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        class="astryx-pagination-button astryx-pagination-prev"
        :disabled="props.disabled || !pagination.canPrevious.value"
        :aria-label="resolvedPrevLabel"
        @click="pagination.previous"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="astryx-pagination-label" aria-hidden="true">{{ resolvedPrevLabel }}</span>
      </button>

      <span v-if="variant === 'input'" class="astryx-pagination-input">
        <span class="astryx-pagination-input-label" aria-hidden="true">{{ resolvedPageLabel }}</span>
        <input
          class="astryx-pagination-input-field"
          type="number"
          inputmode="numeric"
          :min="1"
          :max="pagination.isCursor.value ? undefined : pagination.totalPages.value"
          :value="pageRef"
          :disabled="props.disabled || pagination.isCursor.value"
          :aria-label="messages.pagination.goToPage"
          @change="onInputCommit"
          @keydown.enter="onInputCommit"
        >
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
        class="astryx-pagination-dots"
        role="group"
        :aria-label="messages.pagination.nav"
      >
        <button
          v-for="dotPage in pagination.totalPages.value"
          :key="dotPage"
          type="button"
          class="astryx-pagination-dot"
          :class="{ 'is-active': dotPage === pageRef }"
          :disabled="props.disabled"
          :aria-current="dotPage === pageRef ? 'page' : undefined"
          :aria-label="messages.pagination.page(dotPage)"
          @click="onPageClick(dotPage)"
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
        <button
          v-for="(page, index) in pagination.pageNumbers.value"
          :key="index"
          type="button"
          class="astryx-pagination-page"
          :class="{
            'is-active': page === pageRef,
            'is-ellipsis': isEllipsis(page),
          }"
          :disabled="props.disabled || isEllipsis(page)"
          :aria-label="isEllipsis(page) ? messages.pagination.more : messages.pagination.page(page)"
          :aria-current="page === pageRef ? 'page' : undefined"
          @click="onPageClick(page)"
        >
          {{ isEllipsis(page) ? '...' : page }}
        </button>
      </div>

      <button
        type="button"
        class="astryx-pagination-button astryx-pagination-next"
        :disabled="props.disabled || !pagination.canNext.value"
        :aria-label="resolvedNextLabel"
        @click="pagination.next"
      >
        <span class="astryx-pagination-label" aria-hidden="true">{{ resolvedNextLabel }}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <button
        v-if="showFirstLast"
        type="button"
        class="astryx-pagination-button astryx-pagination-last"
        :disabled="props.disabled || !pagination.canNext.value"
        :aria-label="messages.pagination.last"
        @click="pagination.last"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M5 4L9 8L5 12M9 4L13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div v-if="props.showSizeChanger" class="astryx-pagination-size-changer">
        <span class="astryx-pagination-size-label">{{ resolvedPageSizeLabel }}</span>
        <Selector
          :model-value="pageSizeRef"
          :options="pageSizeOptions"
          :disabled="props.disabled"
          size="sm"
          @update:model-value="(size: string | number | null) => size && pagination.setPageSize(Number(size))"
        />
      </div>
    </div>
  </nav>
</template>
