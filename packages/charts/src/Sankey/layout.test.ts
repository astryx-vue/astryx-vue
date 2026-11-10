import { describe, expect, it } from 'vitest'
import { sankeyLinks, sankeyNodes } from '../../test-support/sankey.js'
import { computeSankeyLayout, resolveSankeyColumns } from './layout.js'

describe('sankey layout', () => {
  it('auto-detects columns and computes exact node and ribbon geometry', () => {
    const layout = computeSankeyLayout(sankeyNodes, sankeyLinks, { width: 1000, height: 300 })
    expect(layout.columns.map(column => column.ids)).toEqual([['a'], ['b'], ['c']])
    expect(layout.valueScale).toBe(32)
    expect(layout.maxValue).toBe(8)
    expect(layout.nodes.map(node => ({ id: node.id, x: node.x, y: node.y, height: node.height }))).toEqual([
      { id: 'a', x: 0, y: 28, height: 256 },
      { id: 'b', x: 490, y: 28, height: 256 },
      { id: 'c', x: 980, y: 28, height: 256 },
    ])
    expect(layout.links[0]).toMatchObject({ sourceY: 28, targetY: 28, height: 128 })
  })

  it('accepts mixed simple and rich column definitions and reserves header space', () => {
    const columns = [['a'], { ids: ['b'], label: 'Middle' }, { ids: ['c'], label: 'Target' }]
    const layout = computeSankeyLayout(sankeyNodes, sankeyLinks, { width: 1000, height: 300, columns })
    expect(resolveSankeyColumns(sankeyNodes, sankeyLinks, columns)).toEqual([
      { ids: ['a'] },
      { ids: ['b'], label: 'Middle' },
      { ids: ['c'], label: 'Target' },
    ])
    expect(layout.valueScale).toBe(29.5)
    expect(layout.columns[1].label).toBe('Middle')
  })

  it('stacks successive outgoing and incoming links without overlap', () => {
    const nodes = [
      { id: 'a', label: 'A', value: 6 },
      { id: 'b', label: 'B', value: 6 },
      { id: 'c', label: 'C', value: 6 },
      { id: 'd', label: 'D', value: 6 },
    ]
    const links = [
      { source: 'a', target: 'c', value: 2 },
      { source: 'a', target: 'd', value: 4 },
      { source: 'b', target: 'c', value: 4 },
      { source: 'b', target: 'd', value: 2 },
    ]
    const layout = computeSankeyLayout(nodes, links, { width: 500, height: 300 })
    expect(layout.links[0].sourceY).toBe(28)
    expect(layout.links[1].sourceY).toBe(28 + layout.links[0].height)
    expect(layout.links[0].targetY).toBe(28)
    expect(layout.links[2].targetY).toBe(28 + layout.links[0].height)
  })

  it('skips links whose endpoints are absent from the layout', () => {
    const layout = computeSankeyLayout(sankeyNodes, [
      ...sankeyLinks,
      { source: 'a', target: 'missing', value: 2 },
    ], { width: 1000, height: 300 })
    expect(layout.links).toHaveLength(2)
  })

  it('keeps degenerate and non-finite input free of NaN geometry', () => {
    const layout = computeSankeyLayout([
      { id: 'a', label: 'A', value: Number.NaN },
      { id: 'b', label: 'B', value: Number.POSITIVE_INFINITY },
      { id: 'c', label: 'C', value: -2 },
    ], [
      { source: 'a', target: 'b', value: Number.NaN },
      { source: 'b', target: 'c', value: -1 },
    ], { width: 0, height: 0, nodeGap: 100 })
    const values = layout.nodes.flatMap(node => [node.x, node.y, node.width, node.height])
    values.push(...layout.links.flatMap(link => [link.height, link.sourceY, link.targetY]))
    expect(values.every(Number.isFinite)).toBe(true)
    expect(values.every(value => value >= 0)).toBe(true)
    expect(layout.valueScale).toBe(0)
  })

  it('places cyclic and isolated nodes in a finite first-column fallback', () => {
    const nodes = [{ id: 'a', label: 'A', value: 1 }, { id: 'b', label: 'B', value: 1 }]
    const layout = computeSankeyLayout(nodes, [
      { source: 'a', target: 'b', value: 1 },
      { source: 'b', target: 'a', value: 1 },
    ], { width: 200, height: 200 })
    expect(layout.columns).toHaveLength(1)
    expect(layout.nodes.map(node => node.column)).toEqual([0, 0])
  })
})
