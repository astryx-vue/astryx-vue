<script setup lang="ts">
import type { ToolbarLink } from './useToolbarLink.js'
import { Popover } from '@astryx-vue/core'
import LinkForm from './LinkForm.vue'
import { useRichTextMessages } from './messages.js'

defineOptions({ name: 'AstryxRichTextToolbarLinkPopover' })

defineProps<{
  link: ToolbarLink
  /** 链接按钮外面的那层元素：按下去不会缩放，浮层锚在它上面。 */
  anchor: HTMLElement | null
  /** 工具栏的尺寸，表单里的控件跟着它。 */
  size: 'sm' | 'md' | 'lg'
}>()

const t = useRichTextMessages()

// 够放下一个常见网址，旁边还留着三个图标按钮的位置。
const WIDTH = 320
</script>

<template>
  <!--
    不由 Popover 接管按钮的点按（`is-enabled` 关掉）：打开、关闭和 `promptForUrl` 都由工具栏的
    链接状态决定，Popover 只负责呈现，以及点外面、Escape 的关闭。
  -->
  <Popover
    :anchor="anchor"
    :label="link.isEditing.value ? t('link.editTitle') : t('link.insertTitle')"
    :is-open="link.isOpen.value"
    :is-enabled="false"
    :is-modal="false"
    :has-close-button="false"
    placement="above"
    alignment="start"
    :width="WIDTH"
    :padding="2"
    @open-change="link.onOpenChange"
  >
    <template #content>
      <LinkForm
        v-if="link.isOpen.value"
        :url="link.url.value"
        :error="link.error.value"
        :is-editing="link.isEditing.value"
        :size="size"
        :on-apply="link.apply"
        @update:url="link.onUrlChange"
        @remove="link.remove()"
        @cancel="link.cancel()"
      />
    </template>
  </Popover>
</template>
