<script setup lang="ts">
/**
 * 一个可重排 List 的会话宿主，List 把它渲染在列表元素旁边。
 * 每次渲染把回调、文案和呈现方式交给会话；挂上鼠标、触摸和命名的监听；
 * 记下这个会话挂在哪个可重排对象上（`start` 靠它找列表）；卸载时收掉会话。
 * 还渲染手柄共用的隐藏说明和重排模式的提示。
 */
import type { ListReorderController } from './reorderController.js'
import type { ListReorderContextValue } from './reorderTypes.js'
import { computed, onMounted, watch, watchEffect } from 'vue'
import { useAnnounce } from '../../composables/internal/announce.js'
import { useCoarsePointer } from '../../composables/useCoarsePointer.js'
import { useComponentMessages } from '../../locale/context.js'
import { listMessages } from '../../locale/messages/list.js'
import { mountSession } from './listReorderEngine.js'
import ListReorderModeHint from './ListReorderModeHint.vue'
import { messagesFrom } from './reorderState.js'

const props = defineProps<{ reorder: ListReorderContextValue }>()

const controller = computed(() => props.reorder.session as ListReorderController)
const announce = useAnnounce()
const messages = useComponentMessages({ list: listMessages })
// 触屏呈现（主指针是粗指针）下，行用弹簧滑到新位置；鼠标下直接落位。
const isTouch = useCoarsePointer()

watchEffect(() => {
  controller.value.configure({
    options: props.reorder.options,
    announce,
    messages: messagesFrom(messages.value.list),
    presentation: isTouch.value ? 'uikit' : 'theme',
  })
}, { flush: 'sync' })

onMounted(() => {
  watch(controller, (session, _previous, onCleanup) => {
    const detachMouse = session.attachMouse()
    const detachNames = session.attachNames()
    onCleanup(() => {
      detachMouse()
      detachNames()
      session.dispose()
    })
  }, { immediate: true, flush: 'post' })
  watch(
    () => [controller.value, props.reorder.options.startedBy ?? props.reorder.options] as const,
    ([session, startedBy], _previous, onCleanup) => onCleanup(mountSession(startedBy, session)),
    { immediate: true, flush: 'post' },
  )
  watch(
    () => [controller.value, isTouch.value] as const,
    ([session, touch], _previous, onCleanup) => onCleanup(session.attachTouch(touch)),
    { immediate: true, flush: 'post' },
  )
})
</script>

<template>
  <span :id="controller.hintId" hidden>{{ messages.list.reorderHint }}</span>
  <ListReorderModeHint :controller="controller" />
</template>
