<script setup lang="ts">
import type { Component } from 'vue'
import type { PlaygroundModules } from './compileSfc'
import type { PlaygroundColorMode, PlaygroundHostMessage } from './protocol'
import * as core from '@astryx-vue/core'
import * as Vue from 'vue'
import { compilePlaygroundSfc } from './compileSfc'
import * as playgroundCharts from './playgroundCharts'
import { PreviewHost } from './previewHost'
import { isHostMessage, PLAYGROUND_CHANNEL } from './protocol'

const { createApp, onBeforeUnmount, onMounted, ref } = Vue

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
  if (event.origin !== window.location.origin || event.source !== window.parent)
    return
  if (!isHostMessage(event.data))
    return
  void accept(event.data)
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
    mount(compiled.component)
    post({ channel: PLAYGROUND_CHANNEL, type: 'ok' })
  }
  catch (error) {
    if (current !== generation)
      return
    post({ channel: PLAYGROUND_CHANNEL, type: 'error', message: errorText(error) })
  }
}

function mount(component: Component): void {
  if (!mountEl.value)
    return
  clearPreview()
  const current = generation
  app = createApp(PreviewHost, { preview: component, locale })
  app.config.errorHandler = (error) => {
    if (current !== generation)
      return
    post({ channel: PLAYGROUND_CHANNEL, type: 'error', message: errorText(error) })
  }
  app.mount(mountEl.value)
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
  window.parent.postMessage(message, window.location.origin)
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
