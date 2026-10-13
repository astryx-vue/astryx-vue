<script setup lang="ts">
import type { PlaygroundFrameMessage, PlaygroundHostMessage, PlaygroundLocale } from './protocol'
import type { DensityPreset, ThemeColorKey, ThemeState } from './theme'
import { withBase } from 'vitepress'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import PlaygroundCodeEditor from './PlaygroundCodeEditor.vue'
import PlaygroundThemeEditor from './PlaygroundThemeEditor.vue'
import { isFrameMessage, PLAYGROUND_CHANNEL } from './protocol'
import { exportThemeCss, exportThemeJson, fontStylesheetHref, previewCss } from './theme'
import { usePlayground } from './usePlayground'

const props = defineProps<{
  locale: PlaygroundLocale
}>()

const dialog = ref<HTMLDialogElement | null>(null)
const iframe = ref<HTMLIFrameElement | null>(null)
const templateRoot = ref<HTMLElement | null>(null)
const editorPane = ref<HTMLElement | null>(null)
const bodyEl = ref<HTMLElement | null>(null)
const tab = ref<'code' | 'theme'>('code')
const pane = ref<'edit' | 'preview'>('edit')
const fullscreen = ref(false)
const templateOpen = ref(false)
const frameReady = ref(false)
const sawPreview = ref(false)
const errorText = ref('')
const statusText = ref('')
const editorSize = ref('42%')
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
  isNeutral,
  density,
  loadTemplate,
  resetTheme,
  reloadPreview,
  setColor,
  selectDensity,
  buildShareUrl,
} = usePlayground(props.locale, ask)

const frameSrc = withBase('/playground/frame')
const styleText = computed(() => previewCss(theme))
const fontHref = computed(() => fontStylesheetHref(theme))
const groups = computed(() => (['chat', 'form', 'table', 'shell'] as const).map(id => ({
  id,
  label: copy.groups[id] ?? id,
  items: templates.filter(item => item.group === id),
})))

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

async function openShare(): Promise<void> {
  templateOpen.value = false
  await buildShareUrl()
  dialogMode.value = 'share'
  dialog.value?.showModal()
}

function openExport(): void {
  templateOpen.value = false
  dialogMode.value = 'export'
  dialog.value?.showModal()
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

function templateLabel(id: string): string {
  return copy.templateNames[id] ?? id
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
    <h1 class="playground__title">
      {{ copy.title }}
    </h1>
    <div class="playground__toolbar">
      <div class="playground__tabs" role="tablist">
        <button type="button" role="tab" :aria-selected="tab === 'code'" @click="tab = 'code'">
          <span class="playground__icon" aria-hidden="true"><span class="i-carbon-code" /></span>
          {{ copy.code }}
        </button>
        <button type="button" role="tab" :aria-selected="tab === 'theme'" @click="tab = 'theme'">
          <span class="playground__icon" aria-hidden="true"><span class="i-carbon-color-palette" /></span>
          {{ copy.theme }}
        </button>
      </div>

      <div ref="templateRoot" class="playground__menu-wrap">
        <button
          type="button"
          class="playground__menu-button"
          :aria-expanded="templateOpen"
          aria-haspopup="menu"
          @click="templateOpen = !templateOpen"
        >
          <span class="playground__icon" aria-hidden="true"><span class="i-carbon-template" /></span>
          <span class="playground__button-text">{{ copy.templates }}</span>
          <span class="playground__icon" aria-hidden="true"><span class="i-carbon-chevron-down" /></span>
        </button>
        <div v-if="templateOpen" class="playground__menu" role="menu">
          <div v-for="group in groups" :key="group.id" class="playground__menu-group" role="group" :aria-label="group.label">
            <p>{{ group.label }}</p>
            <button
              v-for="item in group.items"
              :key="item.id"
              type="button"
              role="menuitem"
              :aria-current="item.id === templateId ? 'true' : undefined"
              @click="chooseTemplate(item.id)"
            >
              {{ templateLabel(item.id) }}
            </button>
          </div>
        </div>
      </div>

      <button type="button" :aria-pressed="isNeutral" @click="resetTheme">
        {{ copy.neutral }}
      </button>

      <div class="playground__spacer" />

      <div class="playground__panes" role="radiogroup" :aria-label="copy.preview">
        <button type="button" role="radio" :aria-checked="pane === 'edit'" @click="pane = 'edit'">
          {{ copy.edit }}
        </button>
        <button type="button" role="radio" :aria-checked="pane === 'preview'" @click="pane = 'preview'">
          {{ copy.preview }}
        </button>
      </div>

      <button type="button" :aria-label="copy.reload" @click="reloadPreview">
        <span class="playground__icon" aria-hidden="true"><span class="i-carbon-renew" /></span>
        <span class="playground__button-text">{{ copy.reload }}</span>
      </button>
      <button type="button" :aria-label="fullscreen ? copy.exitFullscreen : copy.fullscreen" :aria-pressed="fullscreen" @click="fullscreen = !fullscreen">
        <span class="playground__icon" aria-hidden="true"><span :class="fullscreen ? 'i-carbon-exit' : 'i-carbon-fit-to-screen'" /></span>
        <span class="playground__button-text">{{ fullscreen ? copy.exitFullscreen : copy.fullscreen }}</span>
      </button>
      <button type="button" :aria-label="copy.share" @click="openShare">
        <span class="playground__icon" aria-hidden="true"><span class="i-carbon-share" /></span>
        <span class="playground__button-text">{{ copy.share }}</span>
      </button>
      <button type="button" :aria-label="copy.exportTheme" @click="openExport">
        <span class="playground__icon" aria-hidden="true"><span class="i-carbon-download" /></span>
        <span class="playground__button-text">{{ copy.exportTheme }}</span>
      </button>
    </div>

    <div ref="bodyEl" class="playground__body">
      <section ref="editorPane" class="playground__editor">
        <PlaygroundCodeEditor
          v-if="hydrated"
          v-show="tab === 'code'"
          :model-value="code"
          :label="copy.code"
          :active="tab === 'code'"
          @update:model-value="code = $event"
        />
        <PlaygroundThemeEditor
          v-if="hydrated"
          v-show="tab === 'theme'"
          :theme="theme"
          :locale="locale"
          :density="density"
          @field="onField"
          @color="onColor"
          @density="onDensity"
        />
      </section>
      <button
        type="button"
        class="playground__divider"
        :aria-label="copy.resize"
        @pointerdown="onDividerDown"
        @keydown="onDividerKey"
      />
      <section class="playground__preview">
        <p v-if="!sawPreview" class="playground__status">
          {{ copy.loading }}
        </p>
        <pre v-if="errorText" class="playground__error">{{ errorText }}</pre>
        <iframe
          ref="iframe"
          class="playground__iframe"
          :title="copy.preview"
          :src="frameSrc"
          sandbox="allow-scripts allow-same-origin allow-forms"
          @load="onFrameLoad"
        />
        <p class="playground__note">
          {{ copy.note }}
        </p>
      </section>
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
