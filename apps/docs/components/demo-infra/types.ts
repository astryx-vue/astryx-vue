import type { Component } from 'vue'

export interface DemoSource {
  source: string
  html: string
}

export interface DemoModule {
  className?: string
  component: Component
  dataKind?: string
  source: string
  sourceHtml: string
}
