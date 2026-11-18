export type PreviewLayoutMode = 'fill' | 'center'

/**
 * Match the upstream preview stage. Measure the example while it is still in
 * fill layout: if it already fills the stage width or the stage height, keep
 * it edge to edge so full-page templates retain a definite height. Otherwise
 * center it.
 */
export function previewLayoutMode(
  stageWidth: number,
  stageHeight: number,
  contentWidth: number,
  contentHeight: number,
  bleeds?: boolean,
): PreviewLayoutMode {
  // 原版预览宿主始终居中并留 16px 内边距，只有能借出容器内边距的根（Layout 一类）铺满。
  // 已知不借出的根（比如 Section）不看尺寸，一律居中。
  if (bleeds === false)
    return 'center'
  const fillsWidth = contentWidth >= stageWidth - 2
  const fillsHeight = contentHeight >= stageHeight - 2
  return fillsWidth || fillsHeight ? 'fill' : 'center'
}
