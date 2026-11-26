<script setup lang="ts">
import type { InfiniteScrollRuntime } from './plugins/infiniteScroll.js'
import { computed, shallowRef, watch } from 'vue'
import Button from '../Button/Button.vue'
import { devWarn } from '../composables/useDevWarning.js'
import { useComponentMessages } from '../locale/context.js'
import { tableMessages } from '../locale/messages/table.js'

defineOptions({ name: 'AstryxTableLoadMore' })

const props = defineProps<{ runtime: InfiniteScrollRuntime }>()

const messages = useComponentMessages({ table: tableMessages })
const surface = shallowRef<HTMLElement | null>(null)
const sentinel = shallowRef<HTMLElement | null>(null)

const hasMore = computed(() => props.runtime.config().hasMore)
const isBusy = computed(() => props.runtime.config().isLoading || props.runtime.state.isPending)
const canObserve = computed(() => hasMore.value && !isBusy.value && !props.runtime.state.isAutoPaused)

/**
 * 看见表格末尾就自动加载一批。观察以浏览器视口为根，不往上找滚动祖先，也不提前量。
 * 每次能发请求时都重新观察：一批太短、末尾还在视口里时，重新观察会再报一次可见，接着加载下一批。
 */
watch([canObserve, sentinel], ([observe, node], _previous, onCleanup) => {
  if (!observe || node == null)
    return
  if (typeof IntersectionObserver === 'undefined') {
    devWarn('useTableInfiniteScroll', 'IntersectionObserver is unavailable; use the manual Load more command.')
    return
  }
  const observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting))
      props.runtime.request(true)
  }, { root: null, rootMargin: '0px', threshold: 0 })
  observer.observe(node)
  onCleanup(() => observer.disconnect())
}, { flush: 'post' })

/**
 * 数据加载完、按钮被拿掉时，如果焦点正在按钮上，就交给表格的滚动区，不滚动页面。
 * 滚动区本身不是 Tab 停靠点时临时借一个 `tabindex="-1"`，焦点离开就还回去。
 */
function handOffFocus(): void {
  const owner = surface.value
  const scrollRegion = owner?.closest<HTMLElement>('.astryx-table-scroll')
  if (owner == null || scrollRegion == null || !owner.contains(document.activeElement))
    return
  const borrowed = !scrollRegion.hasAttribute('tabindex')
  if (borrowed) {
    scrollRegion.setAttribute('tabindex', '-1')
    scrollRegion.addEventListener('blur', () => scrollRegion.removeAttribute('tabindex'), { once: true })
  }
  scrollRegion.focus({ preventScroll: true })
}

watch(hasMore, (next, previous) => {
  if (previous && !next)
    handOffFocus()
}, { flush: 'pre' })
</script>

<template>
  <div v-if="hasMore" ref="surface" class="astryx-table__load-more">
    <div ref="sentinel" class="astryx-table__load-more-sentinel" aria-hidden="true" />
    <Button
      class="astryx-table__load-more-command"
      :label="messages.table.loadMore"
      :is-loading="isBusy"
      @click="runtime.request(false)"
    />
  </div>
</template>
