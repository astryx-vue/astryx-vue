export interface CitationSource {
  /** Visible label. Falls back to the citation number. */
  title?: string
  /** Destination. When set, the citation renders as a link that opens in a new tab. */
  url?: string
  /** Favicon or logo URL. */
  src?: string
  /**
   * Image URL, or a CSS icon class.
   * A value that looks like a URL is drawn as an image. Any other string is
   * passed to `Icon` as a class. When both `icon` and `src` are set, `icon` wins.
   */
  icon?: string
}

export interface CitationProps {
  source: CitationSource
  /** 1-based index spoken in the accessible name and shown by the number variant. */
  number: number
  /**
   * `label` is a chip with the source title. `number` is a compact superscript.
   * @default 'label'
   */
  variant?: 'label' | 'number'
}
