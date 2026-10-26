<script setup lang="ts">
import type { Component } from 'vue'
import type { PlaygroundModules } from './compileSfc'
import type { PlaygroundColorMode, PlaygroundFrameMessage, PlaygroundHostMessage } from './protocol'
import * as core from '@astryx-vue/core'
import * as Vue from 'vue'
import { compilePlaygroundSfc } from './compileSfc'
import * as playgroundCharts from './playgroundCharts'
import { acceptHostMessage, readPreviewNonce } from './previewChannel'
import { PreviewHost } from './previewHost'
import { previewLayoutMode } from './previewLayout'
import { PLAYGROUND_CHANNEL } from './protocol'
import { templateIcons } from './templateIcons'

const { createApp, onBeforeUnmount, onMounted, ref } = Vue

void templateIcons

/** 父页面装这次 iframe 时写进 `#` 的标记，只回给带同一个标记的消息。 */
const frameNonce = typeof window === 'undefined' ? null : readPreviewNonce(window.location.hash)

const mountEl = ref<HTMLElement | null>(null)
let app: ReturnType<typeof createApp> | null = null
let generation = 0
let colorMode: PlaygroundColorMode = 'light'
let lastCode = ''
let lastMount = -1
let locale = 'en'
let observer: MutationObserver | null = null

if (typeof document !== 'undefined')
  document.documentElement.dataset.playgroundFrame = ''

onMounted(() => {
  applyColorMode(colorMode)
  observer = new MutationObserver(() => {
    const root = document.documentElement
    const wantDark = colorMode === 'dark'
    if (root.classList.contains('dark') !== wantDark || root.dataset.astryxColorMode !== colorMode)
      applyColorMode(colorMode)
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-astryx-color-mode'] })
  window.addEventListener('message', onMessage)
  post({ channel: PLAYGROUND_CHANNEL, type: 'ready' })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('message', onMessage)
  clearPreview()
})

function onMessage(event: MessageEvent): void {
  const message = acceptHostMessage(event, {
    peer: window.parent,
    origin: window.location.origin,
    nonce: frameNonce,
  })
  if (!message)
    return
  void accept(message)
}

async function accept(message: PlaygroundHostMessage): Promise<void> {
  locale = message.locale
  document.documentElement.lang = message.locale === 'zh' ? 'zh-CN' : 'en'
  applyColorMode(message.colorMode)
  writeStyle('playground-theme', message.css)
  applyFont(message.fontHref)
  if (message.type === 'theme')
    return
  if (message.code === lastCode && message.mountId === lastMount) {
    post({ channel: PLAYGROUND_CHANNEL, type: 'ok' })
    return
  }
  lastCode = message.code
  lastMount = message.mountId
  await render(message.code)
}

async function render(code: string): Promise<void> {
  const current = ++generation
  try {
    const compiled = compilePlaygroundSfc(code, runtimeModules(), locale === 'zh' ? 'zh' : 'en')
    if (current !== generation)
      return
    writeStyle('playground-sfc', compiled.css)
    // 挂载时抛错已经作为 error 发出去了，这里不能再补一条 ok 把它盖掉。
    if (!mount(compiled.component))
      return
    layoutPreview(current)
    post({ channel: PLAYGROUND_CHANNEL, type: 'ok' })
  }
  catch (error) {
    if (current !== generation)
      return
    post({ channel: PLAYGROUND_CHANNEL, type: 'error', message: errorText(error) })
  }
}

/** 挂载预览组件，返回挂载过程中有没有报过错。 */
function mount(component: Component): boolean {
  if (!mountEl.value)
    return false
  clearPreview()
  const current = generation
  let errored = false
  app = createApp(PreviewHost, { preview: component, locale })
  app.config.errorHandler = (error) => {
    if (current !== generation)
      return
    errored = true
    post({ channel: PLAYGROUND_CHANNEL, type: 'error', message: errorText(error) })
  }
  app.mount(mountEl.value)
  return !errored
}

function layoutPreview(renderedGeneration: number, attempt = 0): void {
  if (renderedGeneration !== generation)
    return
  const stage = mountEl.value
  if (!stage)
    return
  stage.dataset.previewLayout = 'fill'
  if ((stage.clientWidth < 2 || stage.clientHeight < 2) && attempt < 5) {
    requestAnimationFrame(() => layoutPreview(renderedGeneration, attempt + 1))
    return
  }
  const root = stage.querySelector('.playground-preview__content')?.firstElementChild
  if (!(root instanceof HTMLElement))
    return
  const rect = root.getBoundingClientRect()
  stage.dataset.previewLayout = previewLayoutMode(stage.clientWidth, stage.clientHeight, rect.width, rect.height)
}

function clearPreview(): void {
  app?.unmount()
  app = null
}

function applyColorMode(mode: PlaygroundColorMode): void {
  colorMode = mode
  const root = document.documentElement
  root.dataset.playgroundFrame = ''
  root.dataset.astryxTheme = 'neutral'
  root.dataset.astryxColorMode = mode
  root.classList.toggle('dark', mode === 'dark')
}

function applyFont(href: string | null): void {
  const existing = document.getElementById('playground-font')
  if (!href) {
    existing?.remove()
    return
  }
  const link = existing instanceof HTMLLinkElement ? existing : document.createElement('link')
  link.id = 'playground-font'
  link.rel = 'stylesheet'
  if (link.dataset.href !== href) {
    link.dataset.href = href
    link.href = href
  }
  if (!existing)
    document.head.appendChild(link)
}

function writeStyle(id: string, css: string): void {
  const existing = document.getElementById(id)
  const style = existing instanceof HTMLStyleElement ? existing : document.createElement('style')
  style.id = id
  style.textContent = css
  if (!existing)
    document.head.appendChild(style)
}

function post(message: { channel: typeof PLAYGROUND_CHANNEL, type: 'ready' | 'error' | 'ok', message?: string }): void {
  if (window.parent === window)
    return
  const outgoing: PlaygroundFrameMessage = { ...message, nonce: frameNonce ?? '' }
  window.parent.postMessage(outgoing, window.location.origin)
}

function runtimeModules(): PlaygroundModules {
  return {
    vue: Vue as unknown as PlaygroundModules['vue'],
    core: core as unknown as PlaygroundModules['core'],
    charts: playgroundCharts as unknown as PlaygroundModules['charts'],
  }
}

function errorText(error: unknown): string {
  if (error instanceof Error)
    return error.message
  return String(error)
}
</script>

<template>
  <div id="playground-mount" ref="mountEl" data-playground-page />
</template>
