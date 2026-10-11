<script setup lang="ts">
import type { PaginationDensity } from '../composables/usePagination.js'
import type { SelectorOption } from '../Selector/types.js'
import type { PaginationEmits, PaginationProps, PaginationSlots } from './types.js'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { paginationDensityForWidth, siblingCountForDensity, usePagination } from '../composables/usePagination.js'
import { useAstryxMessages } from '../locale/index.js'
import Selector from '../Selector/Selector.vue'
import '../../styles/pagination.css'

defineOptions({ name: 'AstryxPagination' })

const props = withDefaults(defineProps<PaginationProps>(), {
  page: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: false,
  pageSizeOptions: () => [10, 20, 50, 100],
  showTotal: false,
  disabled: false,
})

const emit = defineEmits<PaginationEmits>()
defineSlots<PaginationSlots>()

const messages = useAstryxMessages()
const resolvedPrevLabel = computed(() => props.prevLabel ?? messages.value.pagination.previous)
const resolvedNextLabel = computed(() => props.nextLabel ?? messages.value.pagination.next)
const resolvedPageSizeLabel = computed(() => props.pageSizeLabel ?? messages.value.pagination.perPage)

const pageRef = ref(props.page)
const pageSizeRef = ref(props.pageSize)
const totalRef = ref(props.total)
const root = ref<HTMLElement | null>(null)
const density = ref<PaginationDensity>('full')
const siblingCount = computed(() => siblingCountForDensity(density.value))
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
  onPageChange: (page) => {
    pageRef.value = page
    emit('update:page', page)
    emit('change', page, pageSizeRef.value)
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
  totalRef.value = props.total
}

syncFromProps()

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
    :class="{ 'is-disabled': props.disabled }"
    :data-density="density"
    role="navigation"
    :aria-label="messages.pagination.nav"
  >
    <div v-if="props.showTotal" class="astryx-pagination-total">
      <slot name="total" :total="totalRef" :from="fromIndex" :to="toIndex">
        {{ messages.pagination.total(totalRef, fromIndex, toIndex) }}
      </slot>
    </div>

    <div class="astryx-pagination-content">
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

      <span class="astryx-pagination-compact" :aria-hidden="density === 'minimal' ? undefined : true">
        {{ messages.pagination.compact(pageRef, pagination.totalPages.value) }}
      </span>

      <div v-show="density !== 'minimal'" class="astryx-pagination-pages">
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
