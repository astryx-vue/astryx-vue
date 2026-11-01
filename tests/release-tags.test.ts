import { describe, expect, it } from 'vitest'
import { changesetPublishArgs, releasePublishPlan } from '../scripts/release.mjs'

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

  it('refuses to mix lab and stable packages in one tagged publish', () => {
    expect(() => changesetPublishArgs(['@astryx-vue/core', '@astryx-vue/lab'])).toThrow('Lab 必须和稳定包分开发版')
  })
})

describe('releasePublishPlan', () => {
  it('publishes only the stable packages when lab is still unpublished', () => {
    expect(releasePublishPlan(['@astryx-vue/core', '@astryx-vue/themes', '@astryx-vue/lab'])).toEqual({
      args: ['changeset', 'publish'],
      holdBackLab: true,
    })
  })

  it('keeps a lab-only release on canary', () => {
    expect(releasePublishPlan(['@astryx-vue/lab'])).toEqual({
      args: ['changeset', 'publish', '--tag', 'canary'],
      holdBackLab: false,
    })
  })
})
