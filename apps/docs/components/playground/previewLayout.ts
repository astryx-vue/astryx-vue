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
): PreviewLayoutMode {
  const fillsWidth = contentWidth >= stageWidth - 2
  const fillsHeight = contentHeight >= stageHeight - 2
  return fillsWidth || fillsHeight ? 'fill' : 'center'
}
