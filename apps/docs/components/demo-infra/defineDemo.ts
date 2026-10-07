import type { Component } from 'vue'
import type { DemoModule, DemoSource } from './types'

export type { DemoModule } from './types'

export function defineDemo(
  component: Component,
  source: DemoSource,
  options: Omit<DemoModule, 'component' | 'source' | 'sourceHtml'> = {},
): DemoModule {
  return {
    className: options.className,
    component,
    dataKind: options.dataKind,
    source: source.source,
    sourceHtml: source.html,
  }
}
