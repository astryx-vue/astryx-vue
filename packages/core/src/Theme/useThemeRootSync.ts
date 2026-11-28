import type { ThemeMode } from './types.js'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { setRootReducedMotionMark } from '../motion/reducedMotionMark.js'
import { setRootScheme } from './rootSchemeAttr.js'
import { syncReaderTextSize } from './textSizeSync.js'

interface RootEntry {
  name: () => string | null
  mode: () => ThemeMode
  reducesMotion: () => boolean
  scheme: () => 'light' | 'dark' | null
}

interface RootSnapshot {
  theme: string | null
  mode: string | null
  scheme: string | null
  reducedMotion: boolean
}

const entries: RootEntry[] = []
let baseSnapshot: RootSnapshot | null = null

function capture(): RootSnapshot {
  const root = document.documentElement
  return {
    theme: root.getAttribute('data-astryx-theme'),
    mode: root.getAttribute('data-astryx-color-mode'),
    scheme: root.getAttribute('data-astryx-scheme'),
    reducedMotion: root.hasAttribute('data-astryx-reduced-motion'),
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
  writeAttribute('data-astryx-theme', entry.name())
  const mode = entry.mode()
  if (mode === 'light' || mode === 'dark')
    root.setAttribute('data-astryx-color-mode', mode)
  else
    root.removeAttribute('data-astryx-color-mode')
  setRootScheme(root, mode === 'light' || mode === 'dark' ? mode : entry.scheme())
  setRootReducedMotionMark(root, entry.reducesMotion())
}

function restoreBase(): void {
  if (!baseSnapshot)
    return
  writeAttribute('data-astryx-theme', baseSnapshot.theme)
  writeAttribute('data-astryx-color-mode', baseSnapshot.mode)
  writeAttribute('data-astryx-scheme', baseSnapshot.scheme)
  setRootReducedMotionMark(document.documentElement, baseSnapshot.reducedMotion)
  baseSnapshot = null
}

/**
 * The outermost Theme mirrors its name and mode onto `documentElement`, so
 * portaled UI and browser chrome see the same theme. Nested themes do not.
 *
 * It also names the scheme it draws in (`data-astryx-scheme`): its forced
 * mode, else the one scheme the page root draws in (`scheme()`), else none,
 * and the reader's preference decides a theme's color-mode blocks.
 */
export function useThemeRootSync(
  isNested: boolean,
  themeName: () => string | null,
  mode: () => ThemeMode,
  reducesMotion: () => boolean = () => false,
  scheme: () => 'light' | 'dark' | null = () => null,
): void {
  if (isNested || typeof document === 'undefined')
    return

  const entry: RootEntry = { name: themeName, mode, reducesMotion, scheme }
  let stopTextSizeSync: (() => void) | undefined

  onMounted(() => {
    // The root Theme keeps the page's text-size scales current (see dynamicType.ts).
    stopTextSizeSync = syncReaderTextSize(document)
    if (entries.length === 0)
      baseSnapshot = capture()
    entries.push(entry)
    apply(entry)
  })

  watch(() => [themeName(), mode(), reducesMotion(), scheme()] as const, () => {
    if (entries[entries.length - 1] === entry)
      apply(entry)
  })

  onBeforeUnmount(() => {
    stopTextSizeSync?.()
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
