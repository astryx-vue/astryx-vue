import type { CommentUploadedImage } from './types.js'

/**
 * Alt text that cannot break out of Markdown's image brackets; `fallback`
 *  (already localized) stands in for an image with none.
 */
export function safeImageAlt(alt: string, fallback: string): string {
  return alt.replace(/[[\]\r\n]+/g, ' ').trim() || fallback
}

/** A URL that cannot break out of Markdown's image parentheses. */
export function safeMarkdownImageUrl(url: string): string {
  return url
    .trim()
    .replace(/[\s()]/g, character =>
      character === '('
        ? '%28'
        : character === ')'
          ? '%29'
          : encodeURIComponent(character))
}

/**
 * Uploaded images as Markdown, one paragraph each. `fallbackAlt` (already
 *  localized) names an image uploaded without alt text.
 */
export function imagesToMarkdown(
  images: readonly CommentUploadedImage[],
  fallbackAlt: string,
): string {
  return images
    .map(
      image =>
        `![${safeImageAlt(image.alt, fallbackAlt)}](${safeMarkdownImageUrl(image.url)})`,
    )
    .join('\n\n')
}

/** Appends a block (an image, say) to a draft as its own paragraph. */
export function appendDraftBlock(value: string, block: string): string {
  const draft = value.trimEnd()
  return draft === '' ? block : `${draft}\n\n${block}`
}

/** Appends inline content (an emoji, say) to a draft, spaced from its text. */
export function appendDraftInline(value: string, content: string): string {
  if (value === '' || /\s$/.test(value) || /^\s/.test(content))
    return `${value}${content}`
  return `${value} ${content}`
}
