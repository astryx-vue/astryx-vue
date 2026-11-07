import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { changesetPublishArgs, isSignatureLogConflict, labCanaryPublishArgs, releasePublishPlan, withPackagesMarkedPrivate } from '../scripts/release.mjs'

describe('changesetPublishArgs', () => {
  it('keeps stable releases on the default tag', () => {
    expect(changesetPublishArgs(['@astryx-vue/core', '@astryx-vue/themes'])).toEqual(['changeset', 'publish'])
  })

  it('publishes a lab-only release to canary', () => {
    expect(changesetPublishArgs(['@astryx-vue/lab'])).toEqual(['changeset', 'publish', '--tag', 'canary'])
  })

  it('keeps the default command when every version is already published', () => {
    expect(changesetPublishArgs([])).toEqual(['changeset', 'publish'])
  })

  it('tags a mixed batch as canary before the caller splits it', () => {
    // 正式发布不会把两者放同一批；这个分支只在有人直接调用时出现。
    expect(changesetPublishArgs(['@astryx-vue/core', '@astryx-vue/lab'])).toEqual(['changeset', 'publish', '--tag', 'canary'])
  })
})

describe('labCanaryPublishArgs', () => {
  it('publishes only Lab without asking changesets to traverse the stable dependency tree', () => {
    expect(labCanaryPublishArgs()).toEqual(['--filter', '@astryx-vue/lab', 'publish', '--tag', 'canary', '--no-git-checks'])
  })
})

describe('releasePublishPlan', () => {
  it('publishes stable packages first, then lab as canary', () => {
    expect(releasePublishPlan(['@astryx-vue/core', '@astryx-vue/themes', '@astryx-vue/lab'])).toEqual({
      args: ['changeset', 'publish'],
      thenPublishLabAsCanary: true,
    })
  })

  it('keeps a lab-only release on canary', () => {
    expect(releasePublishPlan(['@astryx-vue/lab'])).toEqual({
      args: ['changeset', 'publish', '--tag', 'canary'],
      thenPublishLabAsCanary: false,
    })
  })
})

describe('publish batch isolation', () => {
  it('marks only the selected packages private and restores their manifests', () => {
    const root = mkdtempSync(join(tmpdir(), 'astryx-release-'))
    try {
      for (const dir of ['core', 'lab']) {
        const dirPath = join(root, 'packages', dir)
        mkdirSync(dirPath, { recursive: true })
        writeFileSync(join(dirPath, 'package.json'), JSON.stringify({ name: `@astryx-vue/${dir}`, version: '1.0.0' }), { encoding: 'utf8', recursive: true })
      }
      withPackagesMarkedPrivate(root, ['core'], () => {
        expect(readFileSync(join(root, 'packages/core/package.json'), 'utf8')).toContain('"private": true')
        expect(readFileSync(join(root, 'packages/lab/package.json'), 'utf8')).not.toContain('"private"')
      })
      expect(readFileSync(join(root, 'packages/core/package.json'), 'utf8')).not.toContain('"private"')
    }
    finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})

describe('isSignatureLogConflict', () => {
  it('recognizes the transparency log 409', () => {
    expect(isSignatureLogConflict('TLOG_CREATE_ENTRY_ERROR: error creating tlog entry - (409)')).toBe(true)
  })

  it('leaves other publish failures to the caller', () => {
    expect(isSignatureLogConflict('npm error 403 Forbidden')).toBe(false)
    expect(isSignatureLogConflict('')).toBe(false)
  })
})
