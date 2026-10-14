import type { IconifyIcon } from './registry.js'

export interface BuiltIcon {
  viewBox: string
  body: string
}

/**
 * Turn icon data into a viewBox and a body.
 *
 * Flip and rotation follow Iconify: flip first, then rotate, and a 90 degree
 * turn swaps the canvas. The body is wrapped in a transformed group only when
 * a transform is present, so a plain glyph stays as the collection authored it.
 */
export function iconToSVG(icon: IconifyIcon): BuiltIcon {
  const box = {
    left: icon.left ?? 0,
    top: icon.top ?? 0,
    width: icon.width ?? 16,
    height: icon.height ?? 16,
  }
  let body = icon.body
  const transformations: string[] = []
  const hFlip = icon.hFlip === true
  const vFlip = icon.vFlip === true
  let rotation = icon.rotate ?? 0

  if (hFlip) {
    if (vFlip) {
      rotation += 2
    }
    else {
      transformations.push(`translate(${box.width + box.left} ${0 - box.top})`)
      transformations.push('scale(-1 1)')
      box.top = 0
      box.left = 0
    }
  }
  else if (vFlip) {
    transformations.push(`translate(${0 - box.left} ${box.height + box.top})`)
    transformations.push('scale(1 -1)')
    box.top = 0
    box.left = 0
  }

  if (rotation < 0)
    rotation -= Math.floor(rotation / 4) * 4
  rotation %= 4

  switch (rotation) {
    case 1: {
      const origin = box.height / 2 + box.top
      transformations.unshift(`rotate(90 ${origin} ${origin})`)
      break
    }
    case 2:
      transformations.unshift(`rotate(180 ${box.width / 2 + box.left} ${box.height / 2 + box.top})`)
      break
    case 3: {
      const origin = box.width / 2 + box.left
      transformations.unshift(`rotate(-90 ${origin} ${origin})`)
      break
    }
    default:
      break
  }

  if (rotation % 2 === 1) {
    if (box.left !== box.top) {
      const left = box.left
      box.left = box.top
      box.top = left
    }
    if (box.width !== box.height) {
      const width = box.width
      box.width = box.height
      box.height = width
    }
  }

  if (transformations.length > 0)
    body = `<g transform="${transformations.join(' ')}">${body}</g>`

  return {
    viewBox: `${box.left} ${box.top} ${box.width} ${box.height}`,
    body,
  }
}

function prefixIds(body: string, idPrefix: string): string {
  if (idPrefix === '' || !body.includes('id='))
    return body
  return body
    .replace(/\bid=(["'])([^"']+)\1/g, (_, quote, id) => `id=${quote}${idPrefix}${id}${quote}`)
    .replace(/(\b(?:href|xlink:href)=)(["'])#([^"']+)\2/g, (_, attr, quote, id) => `${attr}${quote}#${idPrefix}${id}${quote}`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${idPrefix}${id})`)
}

/** A complete SVG element for one icon. The caller supplies a unique id prefix. */
export function renderIconMarkup(icon: IconifyIcon, idPrefix: string): string {
  const built = iconToSVG(icon)
  const body = prefixIds(built.body, idPrefix)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${built.viewBox}" width="100%" height="100%" aria-hidden="true" focusable="false">${body}</svg>`
}
