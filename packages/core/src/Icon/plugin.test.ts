import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { astryxIcons, extractIconCandidates } from './plugin.js'

const carbon = {
  prefix: 'carbon',
  width: 32,
  height: 32,
  icons: {
    settings: { body: '<path d="M1"/>' },
    search: { body: '<path d="M2"/>' },
  },
}

function plugin() {
  return astryxIcons({
    collections: ['carbon'],
    loadCollection: prefix => prefix === 'carbon' ? carbon : undefined,
  })
}

describe('icon plugin', () => {
  it('collects colon names and name bindings, and ignores ordinary props', () => {
    const names = extractIconCandidates(`
      <Icon name="carbon:settings" />
      <Icon name='carbon-search' />
      <Icon :name="'carbon:settings'" />
      <Button name="submit" />
      <Field name="full-name" />
      const icon = "carbon:add"
    `)

    expect(names).toContain('carbon:settings')
    expect(names).toContain('carbon-search')
    expect(names).toContain('carbon:add')
    expect(names).toContain('submit')
  })

  it('injects a registration import for each static icon and emits only that body', () => {
    const icons = plugin()
    const result = icons.transform(`<script setup lang="ts">
const label = 'Save'
</script>
<template>
  <Icon name="carbon:settings" />
  <Icon name="carbon-search" />
  <Button name="submit" />
</template>`, '/src/App.vue')

    expect(result?.code).toContain(`import 'virtual:astryx-icon/carbon/settings'`)
    expect(result?.code).toContain(`import 'virtual:astryx-icon/carbon/search'`)
    expect(result?.code).not.toContain('virtual:astryx-icon/carbon/submit')

    const id = icons.resolveId('virtual:astryx-icon/carbon/settings')
    const source = icons.load(id!)
    expect(source).toContain('globalThis["__astryxVueIcons"]')
    expect(source).toContain('["carbon:settings"')
    expect(source).toContain('<path d=\\"M1\\"/>')
    expect(source).not.toContain('M2')
  })

  it('leaves a file alone when it has no icon name', () => {
    const icons = plugin()
    expect(icons.transform('<Button name="submit" />', '/src/App.vue')).toBeUndefined()
  })

  it('does not rewrite the script block Vue extracts from an SFC', () => {
    const icons = plugin()
    const code = `import { Icon } from '@astryx-vue/core/Icon'\nconst name = 'carbon:settings'\n`
    expect(icons.transform(code, '/src/App.vue?vue&type=script&setup=true&lang.ts')).toBeUndefined()
  })

  it('ignores colon strings that are not a configured collection', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const icons = plugin()
    expect(icons.transform(`const event = 'update:modelValue'\nconst time = '17:00'`, '/src/App.ts')).toBeUndefined()
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it('warns when a configured collection cannot be loaded', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const icons = astryxIcons({ collections: ['lucide'], loadCollection: () => undefined })
    icons.transform('<Icon name="lucide:house" />', '/src/App.vue')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('reads collections from the package above a root that has no package.json', async () => {
    const packageDir = await mkdtemp(join(tmpdir(), 'astryx-icons-'))
    const srcDir = join(packageDir, 'docs')
    await mkdir(srcDir)
    await writeFile(join(packageDir, 'package.json'), JSON.stringify({
      devDependencies: { '@iconify-json/carbon': '*' },
    }))

    const icons = astryxIcons({
      loadCollection: prefix => prefix === 'carbon' ? carbon : undefined,
    })
    icons.configResolved({ root: srcDir })
    const result = icons.transform('<Icon name="carbon:settings" />', join(srcDir, 'App.vue'))
    expect(result?.code).toContain(`import 'virtual:astryx-icon/carbon/settings'`)
  })

  it('warns when the collection has no icon by that name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const icons = plugin()
    icons.transform('<Icon name="carbon:missing" />', '/src/App.vue')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
