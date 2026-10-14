<script setup lang="ts">
import type { PlaygroundFrameMessage, PlaygroundHostMessage, PlaygroundLocale } from './protocol'
import type { DensityPreset, ThemeColorKey, ThemeState } from './theme'
import { useData, withBase } from 'vitepress'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import PlaygroundMonacoEditor from './PlaygroundMonacoEditor.vue'
import PlaygroundThemeEditor from './PlaygroundThemeEditor.vue'
import { isFrameMessage, PLAYGROUND_CHANNEL } from './protocol'
import { exportThemeCss, exportThemeJson, fontStylesheetHref, previewCss } from './theme'
import { usePlayground } from './usePlayground'

const props = defineProps<{
  locale: PlaygroundLocale
}>()

const { isDark } = useData()

const dialog = ref<HTMLDialogElement | null>(null)
const iframe = ref<HTMLIFrameElement | null>(null)
const templateRoot = ref<HTMLElement | null>(null)
const editorPane = ref<HTMLElement | null>(null)
const bodyEl = ref<HTMLElement | null>(null)
const tab = ref<'code' | 'theme'>('code')
const pane = ref<'edit' | 'preview'>('edit')
const fullscreen = ref(false)
const device = ref<'desktop' | 'phone'>('desktop')
const templateOpen = ref(false)
const frameReady = ref(false)
const sawPreview = ref(false)
const errorText = ref('')
const statusText = ref('')
const monacoEditor = ref<InstanceType<typeof PlaygroundMonacoEditor> | null>(null)
const editorSize = ref('440px')
const dialogMode = ref<'confirm-template' | 'confirm-theme' | 'share' | 'export' | null>(null)
const dialogResult = ref(false)
let resolveDialog: ((value: boolean) => void) | null = null
let pushTimer = 0
let persistTimer = 0
let codeChanged = false

const {
  copy,
  templates,
  theme,
  code,
  templateId,
  hydrated,
  mountId,
  shareUrl,
  loadTemplate,
  resetTheme,
  reloadPreview,
  setColor,
  selectDensity,
  buildShareUrl,
} = usePlayground(props.locale, ask)

const frameSrc = withBase('/playground/frame')
const homeHref = withBase('/')
const logoHref = withBase('/icon-logo.svg')
const localeHref = withBase(props.locale === 'zh' ? '/en/playground/' : '/playground/')
const styleText = computed(() => previewCss(theme))
const fontHref = computed(() => fontStylesheetHref(theme))
watch(code, () => {
  codeChanged = true
  schedulePush(200)
  schedulePersist()
})

watch([styleText, fontHref, () => theme.dark], () => {
  schedulePush(codeChanged ? 200 : 40)
  schedulePersist()
})

watch(mountId, () => {
  codeChanged = true
  schedulePush(0)
})

watch(hydrated, (ready) => {
  if (ready)
    push('render')
})

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onDocumentKey)
  window.addEventListener('message', onFrameMessage)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onDocumentKey)
  window.removeEventListener('message', onFrameMessage)
  window.clearTimeout(pushTimer)
  window.clearTimeout(persistTimer)
})

function ask(kind: 'template' | 'theme'): Promise<boolean> {
  dialogMode.value = kind === 'template' ? 'confirm-template' : 'confirm-theme'
  dialogResult.value = false
  dialog.value?.showModal()
  return new Promise((resolve) => {
    resolveDialog = resolve
  })
}

function confirmDialog(): void {
  dialogResult.value = true
  dialog.value?.close()
}

function onDialogClose(): void {
  const resolve = resolveDialog
  resolveDialog = null
  dialogMode.value = null
  resolve?.(dialogResult.value)
  dialogResult.value = false
}

async function chooseTemplate(id: string): Promise<void> {
  templateOpen.value = false
  await loadTemplate(id)
}

async function copyShareUrl(): Promise<void> {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    statusText.value = copy.copied
  }
  catch {
    statusText.value = copy.copyFailed
  }
}

function download(filename: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function downloadCss(): void {
  download('astryx-theme.css', exportThemeCss(theme), 'text/css')
}

function downloadJson(): void {
  download('astryx-theme.json', exportThemeJson(theme), 'application/json')
}

function onFrameLoad(): void {
  frameReady.value = true
  push('render')
}

function onFrameMessage(event: MessageEvent): void {
  if (event.origin !== window.location.origin || event.source !== iframe.value?.contentWindow)
    return
  if (!isFrameMessage(event.data))
    return
  const message: PlaygroundFrameMessage = event.data
  if (message.type === 'ready') {
    frameReady.value = true
    push('render')
    return
  }
  if (message.type === 'error') {
    errorText.value = message.message ?? ''
    sawPreview.value = true
    return
  }
  errorText.value = ''
  sawPreview.value = true
}

function schedulePush(delay: number): void {
  if (!hydrated.value || !frameReady.value)
    return
  window.clearTimeout(pushTimer)
  pushTimer = window.setTimeout(() => {
    const type = codeChanged ? 'render' : 'theme'
    codeChanged = false
    push(type)
  }, delay)
}

function schedulePersist(): void {
  if (!hydrated.value)
    return
  window.clearTimeout(persistTimer)
  persistTimer = window.setTimeout(() => {
    void buildShareUrl()
  }, 400)
}

function push(type: PlaygroundHostMessage['type']): void {
  const target = iframe.value?.contentWindow
  if (!target || !hydrated.value)
    return
  const message: PlaygroundHostMessage = {
    channel: PLAYGROUND_CHANNEL,
    type,
    css: styleText.value,
    colorMode: theme.dark ? 'dark' : 'light',
    fontHref: fontHref.value,
    locale: props.locale,
    code: code.value,
    mountId: mountId.value,
  }
  target.postMessage(message, window.location.origin)
}

function onPointerDown(event: PointerEvent): void {
  if (!templateOpen.value)
    return
  const root = templateRoot.value
  if (root && event.target instanceof Node && !root.contains(event.target))
    templateOpen.value = false
}

function onDocumentKey(event: KeyboardEvent): void {
  if (event.key === 'Escape')
    templateOpen.value = false
}

function onDividerDown(event: PointerEvent): void {
  if (event.button !== 0)
    return
  const target = event.currentTarget
  if (!(target instanceof HTMLElement))
    return
  target.setPointerCapture(event.pointerId)
  const startX = event.clientX
  const startWidth = editorPane.value?.getBoundingClientRect().width ?? 0
  const move = (ev: PointerEvent) => {
    const bodyWidth = bodyEl.value?.getBoundingClientRect().width ?? 0
    const next = Math.min(Math.max(startWidth + ev.clientX - startX, 280), Math.max(280, bodyWidth - 280))
    editorSize.value = `${next}px`
  }
  const up = (ev: PointerEvent) => {
    if (target.hasPointerCapture(ev.pointerId))
      target.releasePointerCapture(ev.pointerId)
    target.removeEventListener('pointermove', move)
    target.removeEventListener('pointerup', up)
  }
  target.addEventListener('pointermove', move)
  target.addEventListener('pointerup', up)
}

function onDividerKey(event: KeyboardEvent): void {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
    return
  event.preventDefault()
  const current = editorPane.value?.getBoundingClientRect().width ?? 480
  const delta = event.key === 'ArrowLeft' ? -24 : 24
  editorSize.value = `${Math.max(280, current + delta)}px`
}

function onField(key: keyof ThemeState, value: ThemeState[keyof ThemeState]): void {
  Object.assign(theme, { [key]: value })
}

function onColor(key: ThemeColorKey, value: string): void {
  setColor(key, value)
}

function onDensity(id: DensityPreset['id']): void {
  selectDensity(id)
}

function formatCode(): void {
  if (tab.value !== 'code') {
    tab.value = 'code'
    pane.value = 'edit'
  }
  monacoEditor.value?.formatDocument()
}

function togglePreviewDark(): void {
  theme.dark = !theme.dark
}

async function openExportDialog(): Promise<void> {
  templateOpen.value = false
  await buildShareUrl()
  dialogMode.value = 'export'
  dialog.value?.showModal()
}
</script>

<template>
  <div
    class="playground"
    data-playground-page
    :data-pane="pane"
    :data-fullscreen="fullscreen ? 'true' : 'false'"
    :style="{ '--editor-size': editorSize }"
  >
    <div class="playground__frame">
      <aside class="playground__rail" :aria-label="copy.title">
        <a class="playground__rail-home" :href="homeHref" :aria-label="copy.title">
          <img :src="logoHref" alt="" width="20" height="20">
        </a>
        <div class="playground__rail-tabs" role="tablist" :aria-label="copy.code">
          <button
            type="button"
            class="playground__rail-tab"
            role="tab"
            :aria-selected="tab === 'code'"
            :aria-label="copy.code"
            @click="tab = 'code'"
          >
            <span class="playground__icon" aria-hidden="true"><span class="i-carbon-code" /></span>
          </button>
          <button
            type="button"
            class="playground__rail-tab"
            role="tab"
            :aria-selected="tab === 'theme'"
            :aria-label="copy.theme"
            @click="tab = 'theme'"
          >
            <span class="playground__icon" aria-hidden="true"><span class="i-carbon-color-palette" /></span>
          </button>
        </div>
      </aside>

      <div ref="bodyEl" class="playground__surface">
        <div
          ref="editorPane"
          class="playground__left"
          :class="{ 'playground__left--hidden': pane === 'preview' }"
        >
          <header class="playground__left-header">
            <h1 class="playground__word">
              {{ copy.title }}
            </h1>
            <div class="playground__left-actions">
              <button
                type="button"
                class="playground__pill playground__pill--icon"
                :aria-label="copy.formatCode"
                :disabled="tab !== 'code'"
                @click="formatCode"
              >
                <span class="playground__icon" aria-hidden="true"><span class="i-carbon-magic-wand" /></span>
              </button>
              <button type="button" class="playground__pill" :aria-pressed="tab === 'theme'" @click="tab = 'theme'">
                {{ copy.theme }}
              </button>
              <div ref="templateRoot" class="playground__menu-wrap">
                <button
                  type="button"
                  class="playground__pill"
                  :aria-expanded="templateOpen"
                  aria-haspopup="menu"
                  @click="templateOpen = !templateOpen"
                >
                  <span class="playground__button-text">{{ copy.templates }}</span>
                  <span class="playground__icon" aria-hidden="true"><span class="i-carbon-chevron-down" /></span>
                </button>
                <div
                  v-if="templateOpen"
                  class="playground__menu"
                  role="menu"
                  :aria-label="copy.templates"
                >
                  <button
                    v-for="item in templates"
                    :key="item.id"
                    type="button"
                    role="menuitem"
                    :aria-current="item.id === templateId ? 'true' : undefined"
                    @click="chooseTemplate(item.id)"
                  >
                    {{ item.label }}
                  </button>
                </div>
              </div>
            </div>
          </header>
          <div class="playground__left-body">
            <PlaygroundMonacoEditor
              v-if="hydrated"
              v-show="tab === 'code'"
              ref="monacoEditor"
              :model-value="code"
              :label="copy.code"
              :active="tab === 'code'"
              :color-mode="isDark ? 'dark' : 'light'"
              @update:model-value="code = $event"
            />
            <PlaygroundThemeEditor
              v-if="hydrated"
              v-show="tab === 'theme'"
              :theme="theme"
              @field="onField"
              @color="onColor"
              @density="onDensity"
              @reset-theme="resetTheme"
            />
          </div>
        </div>

        <button
          type="button"
          class="playground__divider"
          :aria-label="copy.resize"
          @pointerdown="onDividerDown"
          @keydown="onDividerKey"
        />

        <section
          class="playground__preview"
          :class="{ 'playground__preview--hidden': pane === 'edit' }"
          :data-device="device"
        >
          <header class="playground__preview-toolbar">
            <div class="playground__preview-toolbar-start">
              <button type="button" class="playground__ghost-icon" :aria-label="copy.reload" @click="reloadPreview">
                <span class="playground__icon" aria-hidden="true"><span class="i-carbon-renew" /></span>
              </button>
            </div>
            <div class="playground__preview-toolbar-center">
              <button
                type="button"
                class="playground__ghost-icon"
                :aria-label="copy.darkMode"
                :aria-pressed="theme.dark"
                @click="togglePreviewDark"
              >
                <span class="playground__icon" aria-hidden="true"><span :class="theme.dark ? 'i-carbon-sun' : 'i-carbon-moon'" /></span>
              </button>
              <div class="playground__device" role="radiogroup" :aria-label="copy.preview">
                <button type="button" class="playground__device-item" role="radio" :aria-checked="device === 'desktop'" :aria-label="copy.deviceDesktop" @click="device = 'desktop'">
                  <span class="playground__icon" aria-hidden="true"><span class="i-carbon-laptop" /></span>
                </button>
                <button type="button" class="playground__device-item" role="radio" :aria-checked="device === 'phone'" :aria-label="copy.devicePhone" @click="device = 'phone'">
                  <span class="playground__icon" aria-hidden="true"><span class="i-carbon-mobile" /></span>
                </button>
              </div>
              <button type="button" class="playground__ghost-icon playground__fullscreen" :aria-label="fullscreen ? copy.exitFullscreen : copy.fullscreen" :aria-pressed="fullscreen" @click="fullscreen = !fullscreen">
                <span class="playground__icon" aria-hidden="true"><span :class="fullscreen ? 'i-carbon-exit' : 'i-carbon-fit-to-screen'" /></span>
              </button>
            </div>
            <div class="playground__preview-toolbar-end">
              <span class="playground__status" :data-ready="sawPreview ? 'true' : 'false'">
                {{ sawPreview ? copy.ready : copy.loading }}
              </span>
              <button type="button" class="playground__export" @click="openExportDialog">
                {{ copy.exportTheme }}
                <span class="playground__icon" aria-hidden="true"><span class="i-carbon-launch" /></span>
              </button>
            </div>
          </header>
          <p class="playground__note">
            {{ copy.note }}
          </p>
          <pre v-if="errorText" class="playground__error">{{ errorText }}</pre>
          <div class="playground__stage-wrap">
            <div class="playground__stage">
              <iframe
                ref="iframe"
                class="playground__iframe"
                :title="copy.preview"
                :src="frameSrc"
                sandbox="allow-scripts allow-same-origin allow-forms"
                @load="onFrameLoad"
              />
            </div>
          </div>
        </section>

        <a class="playground__locale" :href="localeHref">{{ locale === 'zh' ? 'EN' : '中文' }}</a>

        <div class="playground__panes" role="radiogroup" :aria-label="copy.preview">
          <button type="button" class="playground__pill" role="radio" :aria-checked="pane === 'edit'" @click="pane = 'edit'">
            {{ copy.edit }}
          </button>
          <button type="button" class="playground__pill" role="radio" :aria-checked="pane === 'preview'" @click="pane = 'preview'">
            {{ copy.preview }}
          </button>
        </div>
      </div>
    </div>
    <p class="playground__live" aria-live="polite">
      {{ statusText }}
    </p>

    <dialog ref="dialog" class="playground__dialog" @close="onDialogClose">
      <template v-if="dialogMode === 'confirm-template' || dialogMode === 'confirm-theme'">
        <h2>{{ dialogMode === 'confirm-template' ? copy.loadTemplateTitle : copy.resetThemeTitle }}</h2>
        <p>{{ dialogMode === 'confirm-template' ? copy.loadTemplateBody : copy.resetThemeBody }}</p>
        <div class="playground__dialog-actions">
          <button type="button" @click="dialog?.close()">
            {{ copy.cancel }}
          </button>
          <button type="button" @click="confirmDialog">
            {{ copy.continue }}
          </button>
        </div>
      </template>
      <template v-else-if="dialogMode === 'share'">
        <h2>{{ copy.shareTitle }}</h2>
        <label class="playground__dialog-label" for="playground-share-url">
          URL
          <input id="playground-share-url" type="text" readonly :value="shareUrl">
        </label>
        <div class="playground__dialog-actions">
          <button type="button" @click="copyShareUrl">
            {{ copy.copyUrl }}
          </button>
          <button type="button" @click="dialog?.close()">
            {{ copy.close }}
          </button>
        </div>
      </template>
      <template v-else-if="dialogMode === 'export'">
        <h2>{{ copy.exportTitle }}</h2>
        <label class="playground__dialog-label" for="playground-export-share-url">
          {{ copy.shareTitle }}
          <input id="playground-export-share-url" type="text" readonly :value="shareUrl">
        </label>
        <div class="playground__dialog-actions playground__dialog-actions--start">
          <button type="button" @click="copyShareUrl">
            {{ copy.copyUrl }}
          </button>
        </div>
        <div class="playground__dialog-actions">
          <button type="button" @click="downloadCss">
            {{ copy.downloadCss }}
          </button>
          <button type="button" @click="downloadJson">
            {{ copy.downloadJson }}
          </button>
          <button type="button" @click="dialog?.close()">
            {{ copy.close }}
          </button>
        </div>
      </template>
    </dialog>
  </div>
</template>
