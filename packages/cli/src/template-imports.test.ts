import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { runCli } from './cli.ts'
import { assertResponse } from './envelope.ts'
import { importedSpecifiers } from './template-imports.ts'
import { analyzeTemplateNeeds } from './templates.ts'

describe('importedSpecifiers', () => {
  it('reads import statements, re-exports, and dynamic imports from script blocks', () => {
    const source = [
      '<script setup lang="ts">',
      'import type { Ref } from \'vue\'',
      'import {',
      '  Button,',
      '  Card,',
      '} from \'@astryx-vue/core\'',
      'import \'./side-effect.css\'',
      'export { x } from \'lodash-es\'',
      'const lazy = () => import(\'@astryx-vue/lab\')',
      '</script>',
    ].join('\n')
    expect(importedSpecifiers(source).sort()).toEqual(['./side-effect.css', '@astryx-vue/core', '@astryx-vue/lab', 'lodash-es', 'vue'])
  })

  it('ignores specifiers that are only comments, strings, template text, or code samples', () => {
    const source = [
      '<script setup lang="ts">',
      'import { ref } from \'vue\'',
      '// import { x } from \'in-a-line-comment\'',
      '/* import { y } from \'in-a-block-comment\' */',
      'const sample = "import { Button } from \'in-a-string\'"',
      'const block = `import { Card } from \'in-a-template-literal\'`',
      'const url = \'http://example.com/a\'',
      '</script>',
      '<template>',
      '  <CodeBlock :code="`import { Button } from \'@astryxdesign/core/Button\'`" />',
      '  <p>import x from \'in-the-markup\'</p>',
      '</template>',
    ].join('\n')
    expect(importedSpecifiers(source)).toEqual(['vue'])
  })
})

describe('what a copied template needs', () => {
  it('does not ask for a package that only appears in a code sample', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'astryx-vue-imports-'))
    try {
      await writeFile(join(cwd, 'package.json'), JSON.stringify({ dependencies: { 'vue': '^3.5.0', '@astryx-vue/core': '^1.0.0' } }))
      const sample = '<script setup lang="ts">\nimport { Button } from \'@astryx-vue/core\'\n</script>\n<template><CodeBlock :code="`import { B } from \'@astryxdesign/core/Button\'`" /></template>\n'
      expect(analyzeTemplateNeeds(sample, cwd).missingPackages).toEqual([])

      const result = await runCli(['template', 'documentation-technical', 'src/pages/Doc.vue', '--json'], { cwd })
      const data = assertResponse(result.stdout, 'template.copy').data as { missingPackages: string[] }
      expect(data.missingPackages).not.toContain('@astryxdesign/core')
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })
})
