// 原版 en.json 里暂时不接进 upstreamMap 的命名空间（`@astryx.<命名空间>.*`）。
// 这些组件在 Vue 版还没有，接入由对应节点负责，见 docs/adr/0001-new-packages.md。
// 节点接入时把命名空间从这里删掉，再把键写进 packages/core/src/locale/upstream/。
export const UNPORTED_NAMESPACES = {
  chart: 'F2b 图表组件（packages/charts）',
  chartLegend: 'F2b 图表组件（packages/charts）',
  diffViewer: 'F3h lab 代码类',
  mediaPlayer: 'lab 媒体播放器的文案内置在 lab 里，core 的 AstryxMessages 还没有这个命名空间',
  tabBar: 'lab 底部 TabBar 还没有 Vue 版',
  navigationStack: 'lab NavigationStack 还没有 Vue 版',
  searchField: 'lab SearchField 还没有 Vue 版',
  chatVirtualizer: 'lab ChatVirtualizer 还没有 Vue 版',
  rating: 'Rating 还没有 Vue 版',
}

/** 同一个理由下的一组键。 */
function keys(prefix, names, reason) {
  return Object.fromEntries(names.map(name => [`${prefix}${name}`, reason]))
}

// 组件已经移植、但用到这些文案的那部分行为还没跟上的键，逐条写明缺什么。
// 对应行为移植时，把键从这里删掉，写进 upstreamMap 和内置文案。
export const UNPORTED_KEYS = {
  '@astryx.tokenizer.done': 'Tokenizer 底部弹层编辑草稿、按「保存」提交，没有立即生效、用「完成」收尾的流程',
  ...keys('@astryx.list.', [
    'reorderHandle',
    'reorderHandleVerb',
    'reorderHandleAt',
    'reorderHint',
    'reorderPlace',
    'reorderPlaceTop',
    'reorderPlaceEnd',
    'reorderRefused',
    'reorderItemAt',
    'reorderMoveUp',
    'reorderMoveDown',
    'reorderDone',
    'reorderModeDone',
    'reorderPickedUp',
    'reorderDropped',
    'reorderCancelled',
  ], 'List 还没有 createReorderable 拖拽排序'),
  '@astryx.listInput.itemName': 'lab ListInput 还没改用 createReorderable，排序手柄和播报里的记录名由 listInput 自己的文案拼',
  '@astryx.markdownHeadingLinks.copyFailed': 'Markdown 标题没有复制链接按钮，复制失败的提示还没有用处',
  '@astryx.comments.errorAnnouncement': 'lab Comments 错误横幅通过共用播报通道读出还没移植',
  '@astryx.step.status.unavailable': 'Stepper 紧凑布局里禁用步骤的读屏状态词还没移植',
  '@astryx.richTextEditor.link.urlPlaceholder': 'RichTextEditor 的链接编辑还是对话框，换成锚定弹出层还没移植',
  '@astryx.textArea.counter': 'Vue 版 TextArea 计数直接按当前语言的数字格式写成「已输入/上限」，没有要翻译的文字',
  ...keys('@astryx.dateInput.', [
    'nonexistentDate',
    'outOfRangeDate',
  ], 'DateInput、DateTimeInput 保留被拒绝的输入并说明原因还没移植'),
}
