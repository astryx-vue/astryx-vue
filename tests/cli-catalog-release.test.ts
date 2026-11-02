import { describe, expect, it } from 'vitest'
import { cliCatalogReleaseProblem } from '../scripts/check-cli-catalog-release.mjs'

const cliChangeset = `---\n"@astryx-vue/cli": patch\n---\n\nRefresh the catalog.\n`

describe('cli catalog release guard', () => {
  it('allows an unchanged catalog without a changeset', () => {
    expect(cliCatalogReleaseProblem({ catalogChanged: false, cliVersionChanged: false, changesets: [] })).toBeNull()
  })

  it('requires a CLI changeset when the catalog changes', () => {
    expect(cliCatalogReleaseProblem({ catalogChanged: true, cliVersionChanged: false, changesets: [] })).toContain('patch changeset')
  })

  it('accepts a pending CLI changeset', () => {
    expect(cliCatalogReleaseProblem({ catalogChanged: true, cliVersionChanged: false, changesets: [cliChangeset] })).toBeNull()
  })

  it('accepts the version PR after the changeset has been consumed', () => {
    expect(cliCatalogReleaseProblem({ catalogChanged: true, cliVersionChanged: true, changesets: [] })).toBeNull()
  })

  it('does not count another package as a CLI release', () => {
    const coreChangeset = cliChangeset.replace('@astryx-vue/cli', '@astryx-vue/core')
    expect(cliCatalogReleaseProblem({ catalogChanged: true, cliVersionChanged: false, changesets: [coreChangeset] })).toContain('@astryx-vue/cli')
  })
})
