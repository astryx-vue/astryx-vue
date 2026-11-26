import type { SourceFile } from './project.ts'
import type { TemplateAttr, TemplateElement } from './vue-template.ts'

/**
 * What the button check needs to read around a button: which names a component
 * imports from Core, what an attribute is, and which elements around a button
 * cannot act on a press.
 */

const CORE = '@astryx-vue/core'

/**
 * Core components that render their children in place and act on no press:
 * none listens for a click, a pointer or a key that activates.
 */
const LAYOUT_COMPONENTS = new Set([
  'AspectRatio',
  'Blockquote',
  'ButtonGroup',
  'Card',
  'Center',
  'EmptyState',
  'FormLayout',
  'Grid',
  'GridSpan',
  'HStack',
  'Heading',
  'InputGroup',
  'Layout',
  'LayoutContent',
  'LayoutFooter',
  'LayoutHeader',
  'LayoutPanel',
  'MediaTheme',
  'ScrollableArea',
  'Section',
  'Stack',
  'StackItem',
  'Text',
  'Theme',
  'Toolbar',
  'VStack',
])

/** Vue's own components that render their children in place. */
const VUE_WRAPPERS = new Set(['Transition', 'TransitionGroup', 'KeepAlive', 'Teleport', 'Suspense'])

/** HTML elements whose content can act on a press, or that the page does not show as written. */
const ACTING_ELEMENTS = new Set(['a', 'area', 'audio', 'button', 'datalist', 'details', 'dialog', 'embed', 'iframe', 'input', 'label', 'map', 'object', 'optgroup', 'option', 'select', 'summary', 'textarea', 'video'])

/** Events no press on a `type="button"` button causes, so listening only for them does not act on it. */
const NON_PRESS_EVENTS = new Set(['change', 'input', 'invalid', 'reset', 'submit'])

/** ARIA roles that name a landmark or a part of a document; a widget role can take a press. */
const STRUCTURE_ROLES = new Set(['article', 'banner', 'complementary', 'contentinfo', 'document', 'form', 'group', 'list', 'listitem', 'main', 'navigation', 'none', 'note', 'presentation', 'region', 'search'])

/** Directives that decide whether or how often an element renders, never what a press does. */
const RENDER_DIRECTIVES = new Set(['v-if', 'v-else', 'v-else-if', 'v-show', 'v-for', 'v-once', 'v-memo', 'v-cloak', 'v-text', 'v-html'])

const TEST_FILE = /\.(?:test|spec|stories|story|cy|fixture)\.(?:[cm]?[jt]sx?|vue)$/
const TEST_FOLDERS = new Set(['test', 'tests', 'stories', 'fixtures', 'e2e', '__tests__', '__mocks__', '__fixtures__', '__stories__'])

/** Test, story and fixture files, whose buttons are not the app's. */
export function isTestPath(path: string): boolean {
  return TEST_FILE.test(path) || path.split('/').slice(0, -1).some(part => TEST_FOLDERS.has(part))
}

/** The script code of a file: every `<script>` block of a component, or the whole module. */
export function scriptsOf(file: SourceFile): string {
  if (!file.path.endsWith('.vue'))
    return file.text
  return [...file.text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]).join('\n')
}

/**
 * The names a module imports from Core, keyed by the tag a template may write:
 * the local name and its kebab-case form, each mapped to Core's own name.
 */
export function coreImports(script: string): Map<string, string> {
  const names = new Map<string, string>()
  const pattern = new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*['"]${CORE.replace('/', '\\/')}(?:\\/[\\w-]+)?['"]`, 'g')
  for (const match of script.matchAll(pattern)) {
    for (const specifier of match[1]!.split(',')) {
      const parts = specifier.trim().split(/\s+as\s+/)
      const imported = parts[0]?.trim() ?? ''
      if (!imported || imported.startsWith('type '))
        continue
      const local = (parts[1] ?? imported).trim()
      names.set(local, imported)
      names.set(kebab(local), imported)
    }
  }
  return names
}

export function kebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export type AttrKind
  = | { type: 'spread' }
    | { type: 'directive' }
    | { type: 'render' }
    | { type: 'event', name: string }
    | { type: 'prop', name: string, bound: boolean }

/** What an attribute is: a spread, a listener, a directive, or a prop by its camelCase name. */
export function attrKind(attr: TemplateAttr): AttrKind {
  const { name } = attr
  if (name === 'v-bind' || name === 'v-on')
    return { type: 'spread' }
  const event = /^(?:@|v-on:)([\w-]+)/.exec(name)
  if (event)
    return { type: 'event', name: event[1]! }
  if (RENDER_DIRECTIVES.has(name) || name.startsWith('#') || name.startsWith('v-slot'))
    return { type: 'render' }
  if (name.startsWith('v-') && !name.startsWith('v-bind:'))
    return { type: 'directive' }
  const bound = /^(?::|v-bind:|\.)/.test(name)
  const plain = name.replace(/^(?::|v-bind:|\.)/, '').replace(/\..*$/, '')
  return { type: 'prop', name: plain.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()), bound }
}

/** True when every element from `start` up to the template root cannot act on a press. */
export function trustedAround(start: TemplateElement | null, imports: ReadonlyMap<string, string>): boolean {
  for (let element = start; element && element.tag !== ''; element = element.parent) {
    if (!isTrustedElement(element, imports))
      return false
  }
  return true
}

/**
 * An element that holds content in place and takes no press: a Core layout
 * component, one of Vue's own wrappers, a `<template>`, or HTML that is not a
 * control, has no widget role, no listener for a press, no spread props and no
 * directive of its own, and is not disabled or inert.
 */
export function isTrustedElement(element: TemplateElement, imports: ReadonlyMap<string, string>): boolean {
  const { tag } = element
  const core = imports.get(tag)
  const isHtml = /^[a-z][a-z0-9]*$/.test(tag)
  const kind = tag === 'template'
    ? 'template'
    : core && LAYOUT_COMPONENTS.has(core)
      ? 'layout'
      : VUE_WRAPPERS.has(tag) || VUE_WRAPPERS.has(tag.replace(/(?:^|-)([a-z])/g, (_, letter: string) => letter.toUpperCase()))
        ? 'wrapper'
        : isHtml && !ACTING_ELEMENTS.has(tag) && tag !== 'slot' && tag !== 'component' ? 'html' : null
  if (kind === null)
    return false
  for (const attr of element.attrs) {
    const attrType = attrKind(attr)
    if (attrType.type === 'spread' || attrType.type === 'directive')
      return false
    if (attrType.type === 'event' && !NON_PRESS_EVENTS.has(attrType.name))
      return false
    if (attrType.type !== 'prop')
      continue
    const { name, bound } = attrType
    if (['is', 'href', 'to', 'as', 'inert', 'disabled', 'contenteditable'].includes(name) || /^on[A-Z]/.test(name))
      return false
    if (name === 'role' && (bound || !STRUCTURE_ROLES.has(attr.value ?? '')))
      return false
  }
  return true
}
