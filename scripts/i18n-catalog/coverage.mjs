// 原版 en.json 里暂时不接进 upstreamMap 的命名空间（`@astryx.<命名空间>.*`）。
// 这些组件还没移植进 core，接入由对应节点负责，见 docs/adr/0001-new-packages.md。
// 节点接入时把命名空间从这里删掉，再把键写进 packages/core/src/locale/upstream/。
export const UNPORTED_NAMESPACES = {
  chart: 'F2b 图表组件（packages/charts）',
  chartLegend: 'F2b 图表组件（packages/charts）',
  diffViewer: 'F3h lab 代码类',
  emojiPicker: 'F3e lab 对话',
  comments: '原版 lab Comments，ROADMAP 里还没有对应节点',
  commentComposer: '原版 lab Comments，ROADMAP 里还没有对应节点',
}

// 单个键没法接进 upstreamMap 的理由。检查器要求内置文案原样吐出每个占位符的值，
// 而 `select` 型的占位符只会渲染命中的那一支，两条检查互相冲突。
export const UNPORTED_KEYS = {
  '@astryx.listInput.announceAlreadyAtBoundary': '占位符是 select（first/last/other），检查器要求的输出和 select 的渲染结果互相矛盾',
}
