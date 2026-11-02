/**
 * @file language.ts
 * @input A file path from a diff
 * @output inferLanguage(path): the tokenizer language for that extension
 * @position Lab helper used by DiffViewer when `language` is not given
 */

const EXTENSION_LANGUAGES: Record<string, string> = {
  ts: 'ts',
  mts: 'ts',
  cts: 'ts',
  tsx: 'tsx',
  js: 'js',
  mjs: 'js',
  cjs: 'js',
  jsx: 'jsx',
  json: 'json',
  html: 'html',
  htm: 'html',
  xml: 'xml',
  svg: 'svg',
  css: 'css',
  scss: 'scss',
  less: 'less',
  py: 'python',
  sh: 'bash',
  bash: 'bash',
  zsh: 'zsh',
  php: 'php',
  hack: 'hack',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  markdown: 'markdown',
}

/** `src/app.ts` → `ts`; unknown or missing extensions render as plaintext. */
export function inferLanguage(path: string | null): string {
  if (path == null)
    return 'plaintext'

  const base = path.slice(path.lastIndexOf('/') + 1)
  const dot = base.lastIndexOf('.')

  if (dot <= 0)
    return 'plaintext'

  return EXTENSION_LANGUAGES[base.slice(dot + 1).toLowerCase()] ?? 'plaintext'
}
