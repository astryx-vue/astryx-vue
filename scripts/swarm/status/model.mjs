/**
 * 在解析结果上做判断：一致性检查、可开工节点、下游数量、终端摘要。
 * 只读不写，改写在 edit.mjs。
 */
import { expandDeps, parseStateCell } from './roadmap.mjs'
import { isResolved, requiresResolvedDeps, stateByEmoji, stateByKey } from './states.mjs'

/**
 * 以总表为准建出节点表：id → { id, name, phase, state, deps, row, mind }。
 * state 取总表的状态；总表状态写错时为 undefined，check 会报出来。
 */
export function buildGraph(roadmap) {
  const allIds = roadmap.table.map(row => row.id)
  const mindById = new Map(roadmap.mindmap.map(node => [node.id, node]))
  const nodes = new Map()
  for (const row of roadmap.table) {
    if (nodes.has(row.id))
      continue
    const mind = mindById.get(row.id)
    const { ids, unknown } = expandDeps(row.deps, allIds)
    nodes.set(row.id, {
      id: row.id,
      name: row.name,
      phase: mind?.phase ?? row.id[0],
      state: parseStateCell(row.state),
      deps: ids,
      unknownDeps: unknown,
      row,
      mind,
    })
  }
  return nodes
}

function duplicates(ids) {
  const seen = new Set()
  return [...new Set(ids.filter(id => seen.size === seen.add(id).size))]
}

function findCycle(nodes) {
  const color = new Map()
  const stack = []
  const visit = (id) => {
    color.set(id, 'grey')
    stack.push(id)
    for (const dep of nodes.get(id)?.deps ?? []) {
      if (color.get(dep) === 'grey')
        return [...stack.slice(stack.indexOf(dep)), dep]
      if (!color.has(dep) && nodes.has(dep)) {
        const found = visit(dep)
        if (found)
          return found
      }
    }
    stack.pop()
    color.set(id, 'black')
    return null
  }
  for (const id of nodes.keys()) {
    if (!color.has(id)) {
      const found = visit(id)
      if (found)
        return found
    }
  }
  return null
}

/**
 * 一致性检查。返回问题列表，每条 `{ id, message }`，空数组表示全部一致。
 *
 * 检查：两边节点集合相同、没有重复、状态写法合法、emoji 和总表状态一致、
 * 依赖都存在且没有环、「可开工及之后」的节点依赖都已结束。
 */
export function checkRoadmap(roadmap) {
  const problems = []
  const add = (id, message) => problems.push({ id, message })
  const tableIds = roadmap.table.map(row => row.id)
  const mindIds = roadmap.mindmap.map(node => node.id)

  for (const id of duplicates(tableIds))
    add(id, '在总表里出现了不止一次')
  for (const id of duplicates(mindIds))
    add(id, '在进度树状图里出现了不止一次')
  for (const row of roadmap.table) {
    if (!/^[A-Z]\d+[a-z]?$/.test(row.id))
      add(row.id, `总表第 ${row.line + 1} 行的节点编号看不懂`)
  }
  for (const id of mindIds.filter(id => !tableIds.includes(id)))
    add(id, '只出现在进度树状图里，总表没有这一行')
  for (const id of tableIds.filter(id => !mindIds.includes(id)))
    add(id, '只出现在总表里，进度树状图没有这个节点')

  const nodes = buildGraph(roadmap)
  for (const node of nodes.values()) {
    if (!node.state)
      add(node.id, `总表状态「${node.row.state}」不是图例里的写法`)
    if (node.mind) {
      const mindState = stateByEmoji(node.mind.emoji)
      if (!mindState)
        add(node.id, `进度树状图里的「${node.mind.emoji}」不是图例里的 emoji`)
      else if (node.state && mindState !== node.state)
        add(node.id, `进度树状图是 ${mindState.emoji} ${mindState.name}，总表是 ${node.state.emoji} ${node.state.name}`)
    }
    for (const dep of node.unknownDeps)
      add(node.id, `依赖「${dep}」不存在`)
    if (node.deps.includes(node.id))
      add(node.id, '依赖了自己')
    if (node.state && requiresResolvedDeps(node.state)) {
      const pending = node.deps.filter(dep => nodes.get(dep)?.state && !isResolved(nodes.get(dep).state))
      if (pending.length > 0)
        add(node.id, `已经是「${node.state.name}」，但依赖 ${pending.map(dep => `${dep}（${nodes.get(dep).state.name}）`).join('、')}还没完成`)
    }
  }
  const cycle = findCycle(nodes)
  if (cycle)
    add(cycle[0], `依赖成环：${cycle.join(' → ')}`)
  return problems
}

/** 每个节点的全部下游（直接和间接依赖它的节点）数量。 */
export function downstreamCounts(nodes) {
  const dependents = new Map([...nodes.keys()].map(id => [id, []]))
  for (const node of nodes.values()) {
    for (const dep of node.deps)
      dependents.get(dep)?.push(node.id)
  }
  const counts = new Map()
  for (const id of nodes.keys()) {
    const seen = new Set()
    const queue = [...dependents.get(id)]
    while (queue.length > 0) {
      const next = queue.shift()
      if (seen.has(next))
        continue
      seen.add(next)
      queue.push(...dependents.get(next))
    }
    counts.set(id, seen.size)
  }
  return counts
}

/** 依赖都已结束的节点（没有依赖也算）。 */
export function depsResolved(node, nodes) {
  return node.deps.every(dep => nodes.get(dep)?.state && isResolved(nodes.get(dep).state))
}

/**
 * 派活视角的两张清单，都按下游数量从多到少排，相同时保持总表顺序：
 * - unlockable：还是「未开始」、但依赖已经全部结束，应该改成「可开工」。
 * - queued：已经是「可开工」、等待派发。
 */
export function readyNodes(roadmap) {
  const nodes = buildGraph(roadmap)
  const counts = downstreamCounts(nodes)
  const order = [...nodes.keys()]
  const sortByImpact = list => list
    .map(node => ({ id: node.id, name: node.name, downstream: counts.get(node.id) }))
    .sort((a, b) => b.downstream - a.downstream || order.indexOf(a.id) - order.indexOf(b.id))
  const all = [...nodes.values()]
  return {
    unlockable: sortByImpact(all.filter(node => node.state?.key === 'not-started' && depsResolved(node, nodes))),
    queued: sortByImpact(all.filter(node => node.state?.key === 'ready')),
  }
}

/** 终端摘要：按阶段分组，每个节点一行。 */
export function formatShow(roadmap) {
  const nodes = buildGraph(roadmap)
  const out = []
  const tally = new Map()
  for (const phase of roadmap.phases) {
    out.push(phase.title)
    for (const node of [...nodes.values()].filter(n => n.phase === phase.letter)) {
      const state = node.state ?? { emoji: '？', name: node.row.state }
      tally.set(state.name, (tally.get(state.name) ?? 0) + 1)
      const extras = [
        node.row.round !== '' && node.row.round !== '0' ? `第 ${node.row.round} 轮` : '',
        node.row.impl && `实现 ${node.row.impl}`,
        node.row.verify && `验收 ${node.row.verify}`,
        node.row.result,
      ].filter(Boolean)
      out.push(`  ${state.emoji} ${node.id.padEnd(4)} ${node.name}  [${state.name}]${extras.length > 0 ? `  ${extras.join(' · ')}` : ''}`)
    }
    out.push('')
  }
  const order = ['implementing', 'awaiting-verify', 'verifying', 'rework', 'needs-user', 'ready', 'not-started', 'done', 'skipped']
    .map(key => stateByKey(key).name)
  out.push(`合计：${order.filter(name => tally.has(name)).map(name => `${name} ${tally.get(name)}`).join('，')}`)
  return out.join('\n')
}
