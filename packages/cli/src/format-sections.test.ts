import { describe, expect, it } from 'vitest'
import { formatPractices, formatPropsList, formatTable, propColumns } from './format-sections.ts'

const group = {
  heading: 'Card Props',
  rows: [
    { name: '`title`', type: '`string`', default: 'required', description: 'Heading text.' },
    { name: '`tone`', type: '`\'calm\' | \'loud\'`', default: '`\'calm\'`', description: 'Visual weight.' },
    { name: '`id`', type: '`string`', default: '—' },
  ],
}

describe('formatPropsList', () => {
  it('prints one prop per line with the default and the required marker', () => {
    expect(formatPropsList(group, false).split('\n')).toEqual([
      '- `title`: `string` **(required)** - Heading text.',
      '- `tone`: `\'calm\' | \'loud\'` = `\'calm\'` - Visual weight.',
      '- `id`: `string`',
    ])
  })

  it('marks required props in Chinese', () => {
    expect(formatPropsList({ heading: 'x', rows: [{ name: '`a`', type: '`string`', default: '必需', description: '说明。' }] }, true))
      .toBe('- `a`: `string` **（必需）** - 说明。')
  })
})

describe('formatTable', () => {
  it('uses a three-dash rule under every header cell', () => {
    const table = formatTable(group, propColumns(group)).split('\n')
    expect(table[0]).toBe('| Name | Type | Default | Description |')
    expect(table[1]).toBe('| --- | --- | --- | --- |')
  })
})

describe('formatPractices', () => {
  it('labels each run of Do and Don\'t items once', () => {
    expect(formatPractices([
      { guidance: 'Do', text: 'A.' },
      { guidance: 'Do', text: 'B.' },
      { guidance: 'Don\'t', text: 'C.' },
      { guidance: 'Do', text: 'D.' },
    ])).toEqual(['Do:', '- A.', '- B.', '', 'Don\'t:', '- C.', '', 'Do:', '- D.'])
  })
})
