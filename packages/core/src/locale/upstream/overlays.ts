import type { UpstreamMapPart } from './types.js'

/** 浮层、反馈与媒体查看。 */
export const overlaysUpstreamMap: UpstreamMapPart = {
  '@astryx.alertDialog.cancel': [{ path: 'alertDialog.cancel' }],
  '@astryx.dialog.close': [{ path: 'dialog.close' }],
  '@astryx.popover.close': [{ path: 'popover.close' }],
  '@astryx.toast.dismiss': [{ path: 'toast.dismiss' }],
  '@astryx.toast.viewport': [{ path: 'toast.viewport' }],
  '@astryx.banner.dismiss': [{ path: 'banner.dismiss' }],
  '@astryx.banner.dismissTitled': [{ path: 'banner.dismissTitled', args: ['dismiss', 'title'] }],
  '@astryx.banner.collapse': [{ path: 'banner.collapse' }],
  '@astryx.banner.expand': [{ path: 'banner.expand' }],

  '@astryx.lightbox.close': [{ path: 'lightbox.close' }],
  '@astryx.lightbox.previous': [{ path: 'lightbox.previous' }],
  '@astryx.lightbox.next': [{ path: 'lightbox.next' }],
  '@astryx.lightbox.mediaViewer': [{ path: 'lightbox.mediaViewer' }],
  '@astryx.lightbox.zoom': [{ path: 'lightbox.zoom' }],
  '@astryx.lightbox.zoomedIn': [{ path: 'lightbox.zoomedIn' }],
  '@astryx.lightbox.zoomedOut': [{ path: 'lightbox.zoomedOut' }],
  '@astryx.lightbox.imagePosition': [{ path: 'lightbox.imagePosition', args: ['index', 'total'] }],
  '@astryx.lightbox.mediaPosition': [{ path: 'lightbox.mediaPosition', args: ['alt', 'index', 'total'] }],

  '@astryx.carousel.label': [{ path: 'carousel.label' }],
  '@astryx.carousel.scrollLeft': [{ path: 'carousel.scrollLeft' }],
  '@astryx.carousel.scrollRight': [{ path: 'carousel.scrollRight' }],
  '@astryx.carousel.slideLabel': [{ path: 'carousel.slide', args: ['current', 'total'] }],
  '@astryx.thumbnail.remove': [{ path: 'thumbnail.remove', args: ['accessibleName'] }],
  '@astryx.thumbnail.open': [{ path: 'thumbnail.open', args: ['accessibleName'] }],
  '@astryx.thumbnail.fallbackName': [{ path: 'thumbnail.fallbackName' }],
  '@astryx.citation.label': [{ path: 'citation.label', args: ['number', 'title'] }],

  '@astryx.codeBlock.copied': [{ path: 'codeBlock.copied' }],
  '@astryx.codeBlock.copyCode': [{ path: 'codeBlock.copyCode' }],
  '@astryx.codeBlock.code': [{ path: 'codeBlock.code' }],
  '@astryx.markdownHeadingLinks.copy': [{ path: 'markdown.headingLinkCopy', args: ['heading'] }],
  '@astryx.markdownHeadingLinks.copied': [{ path: 'markdown.headingLinkCopied' }],
  '@astryx.markdown.taskList': [{ path: 'markdown.taskList' }],
  '@astryx.markdown.table': [{ path: 'markdown.table' }],
}
