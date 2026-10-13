import type * as Monaco from 'monaco-editor'
import loader from '@monaco-editor/loader'
import githubDark from './codeEditorThemes/github-dark.json'
import githubLight from './codeEditorThemes/github-light.json'

let monacoPromise: Promise<typeof Monaco> | null = null

export function monacoBaseUrl(): string {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}monaco/vs`
}

export async function loadMonaco(): Promise<typeof Monaco> {
  if (!monacoPromise) {
    loader.config({ paths: { vs: monacoBaseUrl() } })
    monacoPromise = loader.init().then((monaco: typeof Monaco) => {
      monaco.editor.defineTheme('github-light', githubLight as Monaco.editor.IStandaloneThemeData)
      monaco.editor.defineTheme('github-dark', githubDark as Monaco.editor.IStandaloneThemeData)
      return monaco
    })
  }
  return monacoPromise
}

export const monacoEditorOptions: Monaco.editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 13,
  lineNumbers: 'on',
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on',
  padding: { top: 12 },
  accessibilitySupport: 'off',
  scrollbar: {
    vertical: 'hidden',
    horizontal: 'hidden',
    verticalScrollbarSize: 0,
    horizontalScrollbarSize: 0,
    useShadows: false,
  },
  overviewRulerLanes: 0,
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
}
