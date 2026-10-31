import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { nextConfig, ownPackagePaths } from '../scripts/docs-tsconfig-paths.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

describe('docs tsconfig package paths', () => {
  it('maps every source entry of every package, and nothing from a third party', () => {
    const paths = ownPackagePaths()
    expect(paths['@astryx-vue/core']).toEqual(['../../packages/core/src/index.ts'])
    expect(paths['@astryx-vue/richtext']).toEqual(['../../packages/richtext/src/index.ts'])
    expect(paths['@astryx-vue/richtext/markdown']).toEqual(['../../packages/richtext/src/markdown.ts'])
    expect(Object.keys(paths).every(key => key.startsWith('@astryx-vue/'))).toBe(true)
  })

  it('does not turn on the global `source` condition, which would pull in third-party sources', () => {
    const config = JSON.parse(nextConfig())
    expect(config.compilerOptions.customConditions).toBeUndefined()
  })

  it('keeps the committed tsconfig in step with the packages', () => {
    expect(readFileSync(join(root, 'apps/docs/tsconfig.json'), 'utf8')).toBe(nextConfig())
  })

  it('keeps the playground alias that is not a published package', () => {
    const config = JSON.parse(nextConfig())
    expect(config.compilerOptions.paths['@astryx-vue/playground-charts']).toEqual(['./components/playground/playgroundCharts.ts'])
  })
})
