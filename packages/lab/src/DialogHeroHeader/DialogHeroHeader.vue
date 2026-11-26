<script setup lang="ts">
import type { DialogHeroHeaderProps, DialogHeroHeaderSlots } from './types.js'
import { dialogMessages, Heading, IconButton, LayoutHeader, MediaTheme, useComponentMessages, useDialogContext, VisuallyHidden } from '@astryx-vue/core'
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, onUpdated, shallowRef } from 'vue'
import '../../styles/dialog-hero-header.css'

defineOptions({ name: 'AstryxDialogHeroHeader' })

const props = withDefaults(defineProps<DialogHeroHeaderProps>(), {
  title: undefined,
  mediaMode: undefined,
  isTitleHidden: false,
  maxLines: undefined,
  hasDivider: undefined,
})
const emit = defineEmits<{ openChange: [isOpen: boolean] }>()
const slots = defineSlots<DialogHeroHeaderSlots>()

const messages = useComponentMessages({ dialog: dialogMessages })
const dialog = useDialogContext()
// 和 DialogHeader 一样：传了 openChange 监听才画关闭按钮。
const hasCloseButton = getCurrentInstance()?.vnode.props?.onOpenChange != null
// 看得见的标题是对话框打开后的默认焦点；隐藏标题和内联预览不抢焦点。
const shouldAutoFocus = computed(() => dialog != null && !dialog.isInline.value && !props.isTitleHidden)

const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6, [role="heading"]'
const customSlot = shallowRef<HTMLElement | null>(null)
let applied: { element: HTMLElement, id: boolean, tabindex: boolean, focus: boolean } | null = null

function release(): void {
  if (applied == null)
    return
  const { element } = applied
  if (applied.id && element.id === dialog?.titleId)
    element.removeAttribute('id')
  if (applied.tabindex)
    element.removeAttribute('tabindex')
  if (applied.focus)
    element.removeAttribute('data-dialog-default-focus')
  applied = null
}

// 调用方自己传的标题：把对话框的标题 id 和默认焦点标记加到它渲染出来的标题元素本身上，
// 不加在外层包装上，焦点目标仍然是标题角色。调用方已经写了的属性不动，清理时只拿掉自己加的。
function syncCustomTitle(): void {
  const slot = customSlot.value
  const heading = slot?.querySelector<HTMLElement>(HEADING_SELECTOR) ?? null
  if (applied != null && applied.element !== heading)
    release()
  if (heading == null || dialog == null || applied != null)
    return
  applied = { element: heading, id: false, tabindex: false, focus: false }
  if (!heading.hasAttribute('id')) {
    heading.id = dialog.titleId
    applied.id = true
  }
  if (shouldAutoFocus.value && !heading.hasAttribute('tabindex')) {
    heading.setAttribute('tabindex', '-1')
    applied.tabindex = true
  }
  if (shouldAutoFocus.value && !heading.hasAttribute('data-dialog-default-focus')) {
    heading.setAttribute('data-dialog-default-focus', '')
    applied.focus = true
  }
}

onMounted(() => {
  syncCustomTitle()
  dialog?.registerTitle(true)
})
onUpdated(syncCustomTitle)
onBeforeUnmount(() => {
  release()
  dialog?.registerTitle(false)
})
</script>

<template>
  <LayoutHeader class="astryx-dialog-hero-header" :has-divider="hasDivider">
    <div class="astryx-dialog-hero-header__media">
      <slot name="media" />
      <MediaTheme v-if="hasCloseButton" :mode="mediaMode ?? 'off'">
        <IconButton
          class="astryx-dialog-hero-header__close" variant="ghost" :label="messages.dialog.close"
          @click="emit('openChange', false)"
        >
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
            <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </IconButton>
      </MediaTheme>
    </div>
    <component :is="isTitleHidden ? VisuallyHidden : 'div'" v-bind="isTitleHidden ? { as: 'div' } : {}">
      <div class="astryx-dialog-hero-header__title-row">
        <div v-if="slots.startContent" class="astryx-dialog-hero-header__start">
          <slot name="startContent" />
        </div>
        <div v-if="slots.title" ref="customSlot" class="astryx-dialog-hero-header__custom-title">
          <slot name="title" />
        </div>
        <Heading
          v-else
          :id="dialog?.titleId"
          class="astryx-dialog-hero-header__heading"
          :level="2"
          :max-lines="maxLines"
          :tabindex="shouldAutoFocus ? -1 : undefined"
          :data-dialog-default-focus="shouldAutoFocus ? '' : undefined"
        >
          {{ title }}
        </Heading>
      </div>
    </component>
  </LayoutHeader>
</template>
