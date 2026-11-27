/** 读屏从 `element` 里念出的文字，`aria-hidden` 的内容不算。 */
function visibleText(element: Element): string {
  const copy = element.cloneNode(true) as Element
  for (const hidden of copy.querySelectorAll('[aria-hidden="true"]'))
    hidden.remove()
  // 只有图标的控件靠图片的 alt、里面的 aria-label 或 svg 的 title 命名，这些也算它的内容。
  for (const named of copy.querySelectorAll('img[alt], [aria-label]')) {
    const name = named.getAttribute(named.tagName === 'IMG' ? 'alt' : 'aria-label') ?? ''
    named.replaceWith(copy.ownerDocument.createTextNode(` ${name} `))
  }
  for (const svg of copy.querySelectorAll('svg')) {
    const title = svg.querySelector('title')?.textContent ?? ''
    svg.replaceWith(copy.ownerDocument.createTextNode(` ${title} `))
  }
  return (copy.textContent ?? '').replace(/\s+/g, ' ').trim()
}

/**
 * 自定义触发器给它所开菜单的名字，按顺序取：自己的 `aria-labelledby` 指向的文字、
 * `aria-label`、表单控件的 `<label>`、input 按钮的 value、自己的文字、`title`。
 */
export function readAccessibleName(element: HTMLElement | null): string | undefined {
  if (element == null)
    return undefined
  const labelledBy = element.getAttribute('aria-labelledby')
  if (labelledBy != null && labelledBy.trim() !== '') {
    const text = labelledBy
      .split(/\s+/)
      .map(id => element.ownerDocument.getElementById(id))
      .filter((node): node is HTMLElement => node != null)
      .map(visibleText)
      .join(' ')
      .trim()
    if (text !== '')
      return text
  }
  const label = element.getAttribute('aria-label')?.trim()
  if (label)
    return label
  const labels = 'labels' in element ? Array.from((element as HTMLInputElement).labels ?? []) : []
  const labelText = labels.map(visibleText).join(' ').trim()
  if (labelText !== '')
    return labelText
  if (element instanceof HTMLInputElement && ['button', 'submit', 'reset'].includes(element.getAttribute('type') ?? '')) {
    const value = element.value.trim()
    if (value !== '')
      return value
  }
  const text = visibleText(element)
  if (text !== '')
    return text
  return element.getAttribute('title')?.trim() || undefined
}
