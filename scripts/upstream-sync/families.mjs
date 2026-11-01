import { NODES } from '../upstream-ledger/rules.mjs'

const CORE_FAMILIES = {
  B1: ['theme-system', 'core'],
  B2: ['reset', 'core'],
  B3: ['interactions', 'core'],
  B4: ['layers', 'core'],
  B5: ['i18n-icons', 'core'],
  B6: ['component-api', 'core'],
  B7: ['utilities', 'core'],
  C1: ['input-fields', 'core'],
  C2: ['selection-controls', 'core'],
  C3: ['selectors', 'core'],
  C4: ['search', 'core'],
  C5: ['date-time', 'core'],
  C6: ['menus', 'core'],
  C7: ['overlays', 'core'],
  C8: ['bottom-sheet', 'core'],
  C9: ['markdown-code', 'core'],
  C10: ['chat', 'core'],
  C11: ['table', 'core'],
  C12: ['lists', 'core'],
  C13: ['navigation', 'core'],
  C14: ['layout', 'core'],
  C15: ['feedback', 'core'],
  C16: ['actions-content', 'core'],
  F3a: ['lab-input', 'lab'],
  F3b: ['lab-display', 'lab'],
  F3c: ['lab-overlays', 'lab'],
  F3d: ['lab-charts-code', 'lab'],
  F3e: ['lab-chat', 'lab'],
  F3f: ['lab-docs', 'lab'],
}

const GROUPS = [
  { id: 'infrastructure', title: '工程质量与同步基础设施', nodes: ['A1', 'A2', 'A3', 'A4', 'E1', 'E2', 'E3', 'E4'], area: 'sync', projectArea: '同步机制' },
  { id: 'themes', title: '主题包', nodes: ['D1', 'D2', 'D3'], area: null, projectArea: 'themes' },
  { id: 'cli-search', title: NODES.D4, nodes: ['D4'], area: 'cli', projectArea: '命令行' },
  { id: 'cli-templates', title: NODES.D5, nodes: ['D5'], area: 'cli', projectArea: '命令行' },
  { id: 'cli-codemod', title: NODES.D6, nodes: ['D6'], area: 'cli', projectArea: '命令行' },
  { id: 'release-docs', title: NODES.D7, nodes: ['D7'], area: 'docs', projectArea: '文档' },
  { id: 'playground', title: NODES.D8, nodes: ['D8'], area: 'docs', projectArea: '文档' },
  { id: 'richtext', title: '富文本编辑器', nodes: ['F0', 'F1a', 'F1b', 'F1c'], area: 'richtext', projectArea: 'richtext' },
  { id: 'charts', title: '图表包', nodes: ['F2a', 'F2b', 'F2c'], area: 'charts', projectArea: 'charts' },
  { id: 'nuxt', title: NODES.F4, nodes: ['F4'], area: 'nuxt', projectArea: 'Nuxt' },
  { id: 'vega', title: NODES.F5, nodes: ['F5'], area: 'charts', projectArea: 'charts' },
  { id: 'build', title: NODES.F6, nodes: ['F6'], area: 'core', projectArea: 'core' },
  { id: 'release', title: '发布与包说明', nodes: ['G1', 'G2', 'G3', 'G4'], area: 'release', projectArea: '发版' },
]

const BY_NODE = new Map()
for (const [node, [id, area]] of Object.entries(CORE_FAMILIES)) {
  BY_NODE.set(node, { id, title: NODES[node], area, projectArea: area === 'lab' ? 'lab' : 'core' })
}
for (const family of GROUPS) {
  for (const node of family.nodes)
    BY_NODE.set(node, family)
}

export function familyForNode(node) {
  const family = BY_NODE.get(node)
  if (!family)
    throw new Error(`节点 ${node} 还没有登记长期组件族`)
  return family
}

export function validateFamilies() {
  return Object.keys(NODES).filter(node => !BY_NODE.has(node))
}
