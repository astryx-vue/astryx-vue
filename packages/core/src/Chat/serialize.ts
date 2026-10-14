/** Read the draft a contenteditable composer would submit. */
export function serializeComposer(node: Node): string {
  let result = ''
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      result += child.textContent ?? ''
    }
    else if (child instanceof HTMLElement) {
      if (child.hasAttribute('data-astryx-token'))
        result += child.getAttribute('data-astryx-token-value') ?? ''
      else if (child.tagName === 'BR')
        result += '\n'
      else
        result += serializeComposer(child)
    }
  }
  return result
}

export function composerHasChip(editable: HTMLElement): boolean {
  return editable.querySelector('[data-astryx-token], [data-astryx-dictation-interim]') != null
}
