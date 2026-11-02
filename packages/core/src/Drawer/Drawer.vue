<script setup lang="ts">
import type { DrawerEmits, DrawerProps, DrawerSlots } from './types.js'
import { computed, useAttrs } from 'vue'
import Dialog from '../Dialog/Dialog.vue'
import '../../styles/drawer.css'

/**
 * 贴边的模态面板。模态、焦点陷阱、焦点归还、滚动锁和 `purpose` 的关闭规则
 * 都由 `Dialog` 负责，这里只决定贴哪一边和多大。
 */
defineOptions({ name: 'AstryxDrawer', inheritAttrs: false })
const props = withDefaults(defineProps<DrawerProps>(), {
  placement: 'end',
  width: 400,
  padding: undefined,
  purpose: 'info',
})
const emit = defineEmits<DrawerEmits>()
defineSlots<DrawerSlots>()
const attrs = useAttrs()

const position = computed(() => (props.placement === 'start'
  ? { start: 0, top: 0, bottom: 0 }
  : { end: 0, top: 0, bottom: 0 }))

const rootAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'),
))
</script>

<template>
  <Dialog
    v-bind="rootAttrs"
    :aria-label="label"
    class="astryx-drawer" :class="[`astryx-drawer--${placement}`, attrs.class]"
    :is-open="isOpen"
    max-height="100dvh"
    :padding="padding"
    :position="position"
    :purpose="purpose"
    :style="attrs.style"
    :width="width"
    @open-change="emit('openChange', $event)"
  >
    <div class="astryx-drawer-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="astryx-drawer-footer">
      <slot name="footer" />
    </div>
  </Dialog>
</template>
