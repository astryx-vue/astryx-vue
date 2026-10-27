<script setup lang="ts">
import type { LogStreamEmits, LogStreamProps } from './types.js'
import { computed, ref, useAttrs } from 'vue'
import LogStreamRow from './LogStreamRow.vue'
import { useLogFollow } from './useLogFollow.js'
import '../../styles/log-stream.css'

defineOptions({ name: 'AstryxLogStream', inheritAttrs: false })

const props = withDefaults(defineProps<LogStreamProps>(), {
  variant: 'default',
  maxHeight: undefined,
  hasTimestamps: true,
  label: 'Log stream',
})

const emit = defineEmits<LogStreamEmits>()
const attrs = useAttrs()

// 跟随状态：父组件绑定 v-model:isFollowing 时受控，不绑定时组件自己管，初始不跟随。
const following = defineModel<boolean>('isFollowing', { default: false })

const hasSource = computed(() => props.entries.some(entry => entry.source != null))
const scrollerStyle = computed(() => (props.maxHeight == null
  ? undefined
  : { maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight }))

// 根元素上的 class 和 style 单独合并，其余属性原样透传。
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const rootClass = computed(() => attrs.class)
const rootStyle = computed(() => attrs.style)

const { scrollerRef, isAtBottom, handleScroll, jumpToLatest } = useLogFollow({
  following,
  onFollowChange: next => emit('followChange', next),
  entryCount: () => props.entries.length,
})

// 滚动区元素交给 useLogFollow 里的 ref，跟滚和读位置都靠它。
function setScroller(el: unknown): void {
  scrollerRef.value = el instanceof HTMLElement ? el : null
}

const expandedIds = ref<Set<string>>(new Set())

function toggleExpanded(id: string): void {
  const next = new Set(expandedIds.value)
  if (next.has(id))
    next.delete(id)
  else
    next.add(id)
  expandedIds.value = next
}
</script>

<template>
  <div
    v-bind="rootAttrs" class="astryx-log-stream" :class="rootClass" :data-variant="variant" :style="rootStyle"
  >
    <!--
      role="log" 隐含 aria-live="polite"：繁忙的日志流每追加一行都会念给读屏软件，
      很吵（WCAG 2.2.2 / 4.1.3）。跟随状态顺便当静音开关——用户不在尾部时
      改成 aria-live="off"，点「跳到最新」恢复念。
    -->
    <div
      :ref="setScroller" class="astryx-log-stream__scroller" role="log" :aria-label="label"
      :aria-live="following ? 'polite' : 'off'" :style="scrollerStyle" @scroll.passive="handleScroll"
    >
      <template v-for="entry in entries" :key="entry.id">
        <slot name="entry" :entry="entry">
          <LogStreamRow
            :entry="entry" :has-timestamps="hasTimestamps" :has-source="hasSource"
            :is-expanded="expandedIds.has(entry.id)" @toggle="toggleExpanded(entry.id)"
          >
            <template v-if="$slots.detail" #detail="slotProps">
              <slot name="detail" v-bind="slotProps" />
            </template>
          </LogStreamRow>
        </slot>
      </template>
    </div>
    <button
      v-if="!following && !isAtBottom && entries.length > 0" type="button" class="astryx-log-stream__jump"
      @click="jumpToLatest"
    >
      Jump to latest ↓
    </button>
  </div>
</template>
