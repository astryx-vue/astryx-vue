import type { ThemeMode } from './types.js'
import { onBeforeUnmount, onMounted, watch } from 'vue'

interface RootEntry {
  name: () => string
  mode: () => ThemeMode
}

interface RootSnapshot {
  theme: string | null
  mode: string | null
}

const entries: RootEntry[] = []
let baseSnapshot: RootSnapshot | null = null

function capture(): RootSnapshot {
  const root = document.documentElement
  return {
    theme: root.getAttribute('data-astryx-theme'),
    mode: root.getAttribute('data-astryx-color-mode'),
  }
}

function writeAttribute(name: string, value: string | null): void {
  const root = document.documentElement
  if (value == null)
    root.removeAttribute(name)
  else
    root.setAttribute(name, value)
}

function apply(entry: RootEntry): void {
  const root = document.documentElement
  root.setAttribute('data-astryx-theme', entry.name())
  const mode = entry.mode()
  if (mode === 'light' || mode === 'dark')
    root.setAttribute('data-astryx-color-mode', mode)
  else
    root.removeAttribute('data-astryx-color-mode')
}

function restoreBase(): void {
  if (!baseSnapshot)
    return
  writeAttribute('data-astryx-theme', baseSnapshot.theme)
  writeAttribute('data-astryx-color-mode', baseSnapshot.mode)
  baseSnapshot = null
}

/**
 * The outermost Theme mirrors its name and mode onto `documentElement`, so
 * portaled UI and browser chrome see the same theme. Nested themes do not.
 */
export function useThemeRootSync(
  isNested: boolean,
  themeName: () => string,
  mode: () => ThemeMode,
): void {
  if (isNested || typeof document === 'undefined')
    return

  const entry: RootEntry = { name: themeName, mode }

  onMounted(() => {
    if (entries.length === 0)
      baseSnapshot = capture()
    entries.push(entry)
    apply(entry)
  })

  watch(() => [themeName(), mode()] as const, () => {
    if (entries[entries.length - 1] === entry)
      apply(entry)
  })

  onBeforeUnmount(() => {
    const index = entries.lastIndexOf(entry)
    if (index >= 0)
      entries.splice(index, 1)
    const top = entries[entries.length - 1]
    if (top)
      apply(top)
    else
      restoreBase()
  })
}
