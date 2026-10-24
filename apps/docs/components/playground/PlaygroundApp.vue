<script setup lang="ts">
import type { PlaygroundLocale } from './protocol'
import type { DensityPreset, ThemeColorKey, ThemeState } from './theme'
import { useData, withBase } from 'vitepress'
import { ref } from 'vue'
import PlaygroundDialog from './PlaygroundDialog.vue'
import PlaygroundMonacoEditor from './PlaygroundMonacoEditor.vue'
import PlaygroundTemplateMenu from './PlaygroundTemplateMenu.vue'
import PlaygroundThemeEditor from './PlaygroundThemeEditor.vue'
import { exportThemeCss, exportThemeJson } from './theme'
import { usePaneResize } from './usePaneResize'
import { usePlayground } from './usePlayground'
import { usePreviewSync } from './usePreviewSync'

const props = defineProps<{
  locale: PlaygroundLocale
}>()

const { isDark } = useData()

const dialog = ref<InstanceType<typeof PlaygroundDialog> | null>(null)
const iframe = ref<HTMLIFrameElement | null>(null)
const editorPane = ref<HTMLElement | null>(null)
const bodyEl = ref<HTMLElement | null>(null)
const tab = ref<'code' | 'theme'>('code')
const pane = ref<'edit' | 'preview'>('edit')
const fullscreen = ref(false)
const device = ref<'desktop' | 'phone'>('desktop')
const templateOpen = ref(false)
const statusText = ref('')
const monacoEditor = ref<InstanceType<typeof PlaygroundMonacoEditor> | null>(null)

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
} = usePlayground(props.locale, kind => dialog.value?.ask(kind) ?? Promise.resolve(false))

const { sawPreview, errorText, onFrameLoad } = usePreviewSync({
  iframe,
  locale: props.locale,
  theme,
  code,
  mountId,
  hydrated,
  persist: buildShareUrl,
})

const { editorSize, onDividerDown, onDividerKey } = usePaneResize(editorPane, bodyEl)

const frameSrc = withBase('/playground/frame')
const homeHref = withBase('/')
const logoHref = withBase('/icon-logo.svg')
const localeHref = withBase(props.locale === 'zh' ? '/en/playground/' : '/playground/')

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
  dialog.value?.openExport()
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
              <PlaygroundTemplateMenu
                v-model:open="templateOpen"
                :label="copy.templates"
                :templates="templates"
                :current-id="templateId"
                @choose="loadTemplate"
              />
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

    <PlaygroundDialog
      ref="dialog"
      :copy="copy"
      :share-url="shareUrl"
      @copy-url="copyShareUrl"
      @download-css="downloadCss"
      @download-json="downloadJson"
    />
  </div>
</template>
