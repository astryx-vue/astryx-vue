import type { SourceFile } from '../../../../packages/cli/src/project.ts'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { findButtonsWithoutAction } from '../../../../packages/cli/src/button-actions.ts'
import { ownsToastViewport } from '../demo-infra/toastDemos.ts'

const root = dirname(fileURLToPath(import.meta.url))

function demoFiles(dir: string): SourceFile[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory())
      return demoFiles(path)
    return path.endsWith('.vue') ? [{ path: relative(root, path), text: readFileSync(path, 'utf8') }] : []
  })
}

describe('docs demos', () => {
  it('give every Core button something to do, so a click in the docs is never silent', () => {
    const { found } = findButtonsWithoutAction(demoFiles(root))
    expect(found.map(item => `${item.file}:${item.line} ${item.label ?? ''}`)).toEqual([])
  })

  it('leave the toast viewport to the page, except where the demo is about the viewport', () => {
    const own = demoFiles(root).filter(file => file.text.includes('<ToastViewport')).map(file => file.path.split('/')[0]!)
    expect(own.filter(slug => !ownsToastViewport(slug))).toEqual([])
  })
})
