// 原版 en.json 里暂时不接进 upstreamMap 的命名空间（`@astryx.<命名空间>.*`）。
// 这些组件还没移植进 core，接入由对应节点负责，见 docs/adr/0001-new-packages.md。
// 节点接入时把命名空间从这里删掉，再把键写进 packages/core/src/locale/upstream/。
export const UNPORTED_NAMESPACES = {
  richTextEditor: 'F1b 富文本编辑器（packages/richtext）',
  chart: 'F2b 图表组件（packages/charts）',
  chartLegend: 'F2b 图表组件（packages/charts）',
  listInput: 'F3a lab 输入类',
  transferList: 'F3a lab 输入类',
  transferListSelector: 'F3a lab 输入类',
  diffViewer: 'F3h lab 代码类',
  emojiPicker: 'F3e lab 对话',
  comments: '原版 lab Comments，ROADMAP 里还没有对应节点',
  commentComposer: '原版 lab Comments，ROADMAP 里还没有对应节点',
}
