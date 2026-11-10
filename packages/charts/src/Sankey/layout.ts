import type {
  SankeyColor,
  SankeyColumn,
  SankeyColumnDef,
  SankeyColumnLayout,
  SankeyLinkDatum,
  SankeyLinkLayout,
  SankeyNodeDatum,
  SankeyNodeLayout,
} from './types.js'

const DEFAULT_PALETTE: SankeyColor[] = [
  [0.65, 0.2, 270],
  [0.6, 0.17, 235],
  [0.62, 0.16, 190],
  [0.64, 0.18, 155],
  [0.58, 0.15, 40],
  [0.55, 0.14, 350],
  [0.54, 0.15, 20],
  [0.56, 0.13, 300],
]

export interface SankeyLayoutOptions {
  width: number
  height: number
  nodeWidth?: number
  nodeGap?: number
  labelMargin?: number
  columns?: SankeyColumn[]
}

export interface SankeyLayoutResult {
  nodes: SankeyNodeLayout[]
  links: SankeyLinkLayout[]
  columns: SankeyColumnLayout[]
  valueScale: number
  maxValue: number
}

function finiteNonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

function normalizeColumns(columns: SankeyColumn[]): SankeyColumnDef[] {
  return columns.map(column => Array.isArray(column) ? { ids: column } : column)
}

/** 自动分列只沿有向边前进；循环或孤立节点放在第一列，不会死循环。 */
function autoColumns(nodes: SankeyNodeDatum[], links: SankeyLinkDatum[]): SankeyColumnDef[] {
  if (nodes.length === 0)
    return []

  const inDegree = new Map<string, number>()
  const outEdges = new Map<string, string[]>()
  for (const node of nodes) {
    inDegree.set(node.id, 0)
    outEdges.set(node.id, [])
  }
  for (const link of links) {
    if (!inDegree.has(link.target))
      continue
    inDegree.set(link.target, (inDegree.get(link.target) ?? 0) + 1)
    outEdges.get(link.source)?.push(link.target)
  }

  const columnById = new Map<string, number>()
  const queue: string[] = []
  for (const node of nodes) {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id)
      columnById.set(node.id, 0)
    }
  }
  for (let index = 0; index < queue.length; index++) {
    const id = queue[index]
    const column = columnById.get(id) ?? 0
    for (const target of outEdges.get(id) ?? []) {
      columnById.set(target, Math.max(columnById.get(target) ?? 0, column + 1))
      inDegree.set(target, (inDegree.get(target) ?? 0) - 1)
      if (inDegree.get(target) === 0)
        queue.push(target)
    }
  }

  const count = Math.max(0, ...columnById.values()) + 1
  const columns = Array.from({ length: count }, () => ({ ids: [] as string[] }))
  for (const node of nodes)
    columns[columnById.get(node.id) ?? 0].ids.push(node.id)
  return columns
}

export function resolveSankeyColumns(
  nodes: SankeyNodeDatum[],
  links: SankeyLinkDatum[],
  columns?: SankeyColumn[],
): SankeyColumnDef[] {
  return columns ? normalizeColumns(columns) : autoColumns(nodes, links)
}

export function computeSankeyLayout(
  nodes: SankeyNodeDatum[],
  links: SankeyLinkDatum[],
  options: SankeyLayoutOptions,
): SankeyLayoutResult {
  const width = finiteNonNegative(options.width)
  const height = finiteNonNegative(options.height)
  const nodeWidth = finiteNonNegative(options.nodeWidth ?? 20)
  const nodeGap = finiteNonNegative(options.nodeGap ?? 14)
  const labelMargin = finiteNonNegative(options.labelMargin ?? 28)
  const columnDefs = resolveSankeyColumns(nodes, links, options.columns)
  const columnCount = columnDefs.length
  const hasHeaders = columnDefs.some(column => column.label)
  const usableHeight = Math.max(0, height - labelMargin - 16 - (hasHeaders ? 20 : 0))
  const maxNodes = Math.max(0, ...columnDefs.map(column => column.ids.length))
  const effectiveGap = maxNodes > 1 ? Math.min(nodeGap, usableHeight / (maxNodes - 1)) : 0

  const nodeById = new Map(nodes.map(node => [node.id, node]))
  let maxValue = 0
  for (const column of columnDefs) {
    const total = column.ids.reduce((sum, id) => sum + finiteNonNegative(nodeById.get(id)?.value ?? 0), 0)
    maxValue = Math.max(maxValue, total)
  }
  const availableHeight = Math.max(0, usableHeight - (maxNodes - 1) * effectiveGap)
  const valueScale = maxValue > 0 ? availableHeight / maxValue : 0
  const columnSpacing = columnCount > 1 ? Math.max(0, width - nodeWidth) / (columnCount - 1) : 0

  const columns: SankeyColumnLayout[] = []
  const nodeLayouts = new Map<string, SankeyNodeLayout>()
  let colorIndex = 0
  columnDefs.forEach((column, columnIndex) => {
    const x = columnIndex * columnSpacing
    columns.push({ x, ids: column.ids, label: column.label })
    const totalHeight = column.ids.reduce((sum, id) => sum + finiteNonNegative(nodeById.get(id)?.value ?? 0) * valueScale, 0)
    const totalGap = Math.max(0, column.ids.length - 1) * effectiveGap
    let y = labelMargin + (usableHeight - totalHeight - totalGap) / 2

    for (const id of column.ids) {
      const node = nodeById.get(id)
      if (!node)
        continue
      const value = finiteNonNegative(node.value)
      const nodeHeight = value * valueScale
      nodeLayouts.set(id, {
        id,
        label: node.label,
        value,
        color: node.color ?? DEFAULT_PALETTE[colorIndex % DEFAULT_PALETTE.length],
        x,
        y,
        width: nodeWidth,
        height: nodeHeight,
        column: columnIndex,
        sourceOffset: 0,
        targetOffset: 0,
      })
      colorIndex++
      y += nodeHeight + effectiveGap
    }
  })

  const layoutLinks: SankeyLinkLayout[] = []
  for (const link of links) {
    const source = nodeLayouts.get(link.source)
    const target = nodeLayouts.get(link.target)
    if (!source || !target)
      continue
    const value = finiteNonNegative(link.value)
    const linkHeight = value * valueScale
    const sourceY = source.y + source.sourceOffset
    const targetY = target.y + target.targetOffset
    source.sourceOffset += linkHeight
    target.targetOffset += linkHeight
    layoutLinks.push({ source, target, value, height: linkHeight, sourceY, targetY })
  }

  return { nodes: [...nodeLayouts.values()], links: layoutLinks, columns, valueScale, maxValue }
}
