<script setup lang="ts">
import type { PlaygroundCopy } from './messages'
import { ref } from 'vue'

/**
 * 演练场共用的一个原生 `<dialog>`：换模板和重置主题前的确认、分享链接、导出主题。
 * 确认框通过 `ask()` 返回用户选了继续还是取消；具体的复制和下载交给父组件处理。
 */
defineProps<{
  copy: PlaygroundCopy
  shareUrl: string
}>()

const emit = defineEmits<{
  copyUrl: []
  downloadCss: []
  downloadJson: []
}>()

type DialogMode = 'confirm-template' | 'confirm-theme' | 'share' | 'export'

const dialog = ref<HTMLDialogElement | null>(null)
const mode = ref<DialogMode | null>(null)
const result = ref(false)
let resolveDialog: ((value: boolean) => void) | null = null

function ask(kind: 'template' | 'theme'): Promise<boolean> {
  mode.value = kind === 'template' ? 'confirm-template' : 'confirm-theme'
  result.value = false
  dialog.value?.showModal()
  return new Promise((resolve) => {
    resolveDialog = resolve
  })
}

function openExport(): void {
  mode.value = 'export'
  dialog.value?.showModal()
}

function close(): void {
  dialog.value?.close()
}

function confirm(): void {
  result.value = true
  close()
}

function onClose(): void {
  const resolve = resolveDialog
  resolveDialog = null
  mode.value = null
  resolve?.(result.value)
  result.value = false
}

defineExpose({ ask, openExport })
</script>

<template>
  <dialog ref="dialog" class="playground__dialog" @close="onClose">
    <template v-if="mode === 'confirm-template' || mode === 'confirm-theme'">
      <h2>{{ mode === 'confirm-template' ? copy.loadTemplateTitle : copy.resetThemeTitle }}</h2>
      <p>{{ mode === 'confirm-template' ? copy.loadTemplateBody : copy.resetThemeBody }}</p>
      <div class="playground__dialog-actions">
        <button type="button" @click="close">
          {{ copy.cancel }}
        </button>
        <button type="button" @click="confirm">
          {{ copy.continue }}
        </button>
      </div>
    </template>
    <template v-else-if="mode === 'share'">
      <h2>{{ copy.shareTitle }}</h2>
      <label class="playground__dialog-label" for="playground-share-url">
        URL
        <input id="playground-share-url" type="text" readonly :value="shareUrl">
      </label>
      <div class="playground__dialog-actions">
        <button type="button" @click="emit('copyUrl')">
          {{ copy.copyUrl }}
        </button>
        <button type="button" @click="close">
          {{ copy.close }}
        </button>
      </div>
    </template>
    <template v-else-if="mode === 'export'">
      <h2>{{ copy.exportTitle }}</h2>
      <label class="playground__dialog-label" for="playground-export-share-url">
        {{ copy.shareTitle }}
        <input id="playground-export-share-url" type="text" readonly :value="shareUrl">
      </label>
      <div class="playground__dialog-actions playground__dialog-actions--start">
        <button type="button" @click="emit('copyUrl')">
          {{ copy.copyUrl }}
        </button>
      </div>
      <div class="playground__dialog-actions">
        <button type="button" @click="emit('downloadCss')">
          {{ copy.downloadCss }}
        </button>
        <button type="button" @click="emit('downloadJson')">
          {{ copy.downloadJson }}
        </button>
        <button type="button" @click="close">
          {{ copy.close }}
        </button>
      </div>
    </template>
  </dialog>
</template>
