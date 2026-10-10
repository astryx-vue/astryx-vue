<script setup lang="ts">
import type { SelectorOption } from '../Selector/types.js'
import type { PaginationEmits, PaginationProps, PaginationSlots } from './types.js'
import { computed, ref } from 'vue'
import { usePagination } from '../composables/usePagination.js'
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
  prevLabel: '上一页',
  nextLabel: '下一页',
  pageSizeLabel: '每页',
})

const emit = defineEmits<PaginationEmits>()
defineSlots<PaginationSlots>()

const pageRef = ref(props.page)
const pageSizeRef = ref(props.pageSize)
const totalRef = ref(props.total)

const pagination = usePagination({
  page: pageRef,
  pageSize: pageSizeRef,
  total: totalRef,
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
    label: `${size} 条/页`,
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
    class="astryx-pagination"
    :class="{ 'is-disabled': props.disabled }"
    role="navigation"
    aria-label="分页导航"
  >
    <!-- 总数显示 -->
    <div v-if="props.showTotal" class="astryx-pagination-total">
      <slot name="total" :total="totalRef" :from="fromIndex" :to="toIndex">
        共 {{ totalRef }} 条，显示 {{ fromIndex }}-{{ toIndex }}
      </slot>
    </div>

    <div class="astryx-pagination-content">
      <!-- 上一页按钮 -->
      <button
        type="button"
        class="astryx-pagination-button astryx-pagination-prev"
        :disabled="props.disabled || !pagination.canPrevious.value"
        :aria-label="props.prevLabel"
        @click="pagination.previous"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{{ props.prevLabel }}</span>
      </button>

      <!-- 页码列表 -->
      <div class="astryx-pagination-pages">
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
          :aria-label="isEllipsis(page) ? '更多页码' : `第 ${page} 页`"
          :aria-current="page === pageRef ? 'page' : undefined"
          @click="onPageClick(page)"
        >
          {{ isEllipsis(page) ? '...' : page }}
        </button>
      </div>

      <!-- 下一页按钮 -->
      <button
        type="button"
        class="astryx-pagination-button astryx-pagination-next"
        :disabled="props.disabled || !pagination.canNext.value"
        :aria-label="props.nextLabel"
        @click="pagination.next"
      >
        <span>{{ props.nextLabel }}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <!-- 页面大小选择器 -->
      <div v-if="props.showSizeChanger" class="astryx-pagination-size-changer">
        <span class="astryx-pagination-size-label">{{ props.pageSizeLabel }}</span>
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
