import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '../../..')
const outputPath = join(here, '../src/generated/catalog.json')
const check = process.argv.includes('--check')

const { assembleCatalog, parseDemoMetaFields } = await import('../../../apps/docs/components/demo-infra/demoMeta.ts')
const { GROUP_TITLES } = await import('../../../apps/docs/components/demo-infra/groups.ts')
const { buildCatalog } = await import('../src/generate/build-catalog.ts')
const { PLAYGROUND_TEMPLATE_META, PLAYGROUND_TEMPLATE_SLUGS } = await import('../../../apps/docs/components/playground/templateManifest.ts')

const templates = PLAYGROUND_TEMPLATE_SLUGS.map((slug) => {
  const meta = PLAYGROUND_TEMPLATE_META[slug]
  return {
    slug,
    title: { en: meta.nameEn, zh: meta.nameZh },
    category: { en: meta.groupEn, zh: meta.categoryZh },
  }
})

const demosDir = join(repoRoot, 'apps/docs/components/demos')
const metas = []
for (const entry of await readdir(demosDir, { withFileTypes: true })) {
  if (!entry.isDirectory())
    continue
  const source = await readFile(join(demosDir, entry.name, 'meta.ts'), 'utf8')
  metas.push(parseDemoMetaFields(source))
}

const catalog = await buildCatalog(repoRoot, assembleCatalog(metas), GROUP_TITLES, templates)
const json = `${JSON.stringify(catalog, null, 2)}\n`
if (check) {
  const current = await readFile(outputPath, 'utf8')
  if (current !== json) {
    console.error('packages/cli/src/generated/catalog.json is stale. Run pnpm --filter @astryx-vue/cli generate')
    process.exitCode = 1
  }
  else {
    console.log(`catalog is up to date (${catalog.components.length} components, ${catalog.topics.length} topics, ${catalog.templates.length} templates)`)
  }
}
else {
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, json)
  console.log(`wrote ${outputPath} (${catalog.components.length} components, ${catalog.topics.length} topics, ${catalog.templates.length} templates)`)
}
