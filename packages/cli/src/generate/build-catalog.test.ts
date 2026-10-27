import type { ExampleRecord } from '../catalog-types.ts'
import { describe, expect, it } from 'vitest'
import { analyzeTemplateImports, pairExamples } from './build-catalog.ts'

function example(title: string, code: string, description = ''): ExampleRecord {
  return { title, description, code }
}

describe('example pairing', () => {
  it('keeps one copy of the code and one title per language', () => {
    const paired = pairExamples(
      'button',
      [example('Floating', '<template><Button /></template>', 'A floating action button.')],
      [example('悬浮', '<template><Button /></template>', '悬浮操作按钮。')],
    )
    expect(paired).toEqual([
      {
        title: { en: 'Floating', zh: '悬浮' },
        description: { en: 'A floating action button.', zh: '悬浮操作按钮。' },
        code: '<template><Button /></template>',
      },
    ])
  })

  it('rejects two pages that show different code for the same example', () => {
    expect(() => pairExamples(
      'button',
      [example('Floating', '<Button />'), example('Sizes', '<Button size="small" />')],
      [example('悬浮', '<Button />'), example('尺寸', '<Button size="large" />')],
    )).toThrowError(/button: example 2 \(en "Sizes", zh "尺寸"\) uses different code/)
  })

  it('rejects two pages that list a different number of examples', () => {
    expect(() => pairExamples(
      'dialog',
      [example('Basic', '<Dialog />')],
      [example('基础', '<Dialog />'), example('长内容', '<Dialog />')],
    )).toThrowError(/dialog: the en page lists 1 examples and the zh page lists 2/)
  })

  it('accepts examples without a demo', () => {
    const paired = pairExamples('table', [example('', '')], [example('', '')])
    expect(paired).toEqual([{ title: { en: '', zh: '' }, description: { en: '', zh: '' }, code: '' }])
  })
})

describe('template imports', () => {
  const installable = new Set(['vue', '@astryx-vue/core', '@astryx-vue/lab'])

  it('lists components from every installable package and flags the rest', () => {
    const source = [
      'import { Button } from \'@astryx-vue/core/Button\'',
      'import type { ContextMenuOption } from \'@astryx-vue/core/ContextMenu\'',
      'import { InfoTip } from \'@astryx-vue/lab\'',
      'import { ref } from \'vue\'',
      'import { Chart } from \'@astryx-vue/playground-charts\'',
      'import \'./local.css\'',
    ].join('\n')
    expect(analyzeTemplateImports(source, installable)).toEqual({
      componentsUsed: ['Button', 'InfoTip'],
      foreignPackages: ['@astryx-vue/playground-charts'],
    })
  })

  it('names a component imported by its own subpath', () => {
    expect(analyzeTemplateImports('import { Card } from \'@astryx-vue/core/Card\'', installable).componentsUsed).toEqual(['Card'])
  })
})
