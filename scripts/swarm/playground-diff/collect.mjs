/**
 * 在预览 iframe 里采集元素。这个函数会被 playwright 序列化后送进页面执行，
 * 所以它只能引用页面里的 API，不能引用模块外部的东西。
 *
 * 采集口径：
 * - 文字元素：有非空直系文本节点的元素，记下文字、坐标、字号、字重、文字颜色、背景色。
 *   坐标取这段文字自己的排版盒（Range 量直系文本节点的外包矩形），不取外层元素的盒子：
 *   原版可能把文字直接放在 `<th>` 里，我们多包了一层 `<span>`，量外层盒子会误判成
 *   位置和尺寸都不同。量文字本身，两边才是同一个东西。
 * - 图标：每个 `<svg>`，用最近的、带文字或 aria-label 的祖先给它配对，只记坐标和尺寸。
 * - 坐标是「把每一层祖先的滚动都还原到 0」以后的绝对坐标，所以滚动容器里看不见的元素
 *   和看得见的元素可以直接比位置。
 * - 滚动容器（表格体、聊天列表）逐段滚过去重扫，虚拟列表里滚进来才存在的元素也能采到。
 *
 * 返回 { items, scanned, scrollers }，items 已经按文档顺序排好。
 */
export async function collectPlaygroundFrame() {
  const TEXT_NODE = 3
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'TEMPLATE', 'NOSCRIPT', 'TITLE'])
  const MAX_SCROLLERS = 12
  const MAX_SCANS = 80
  /** 图标的尺寸上限（像素）：比这个大的一律当图表画布。 */
  const ICON_MAX_SIZE = 64
  /** 一轮滚动之后等这么久，给虚拟列表和动画留时间。 */
  const SETTLE_MS = 40

  const round = value => Math.round(value * 100) / 100

  const items = new Map()
  const orderOf = new Map()
  let order = 0
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT)
  while (walker.nextNode())
    orderOf.set(walker.currentNode, order++)

  function directText(el) {
    let out = ''
    for (const node of el.childNodes) {
      if (node.nodeType === TEXT_NODE)
        out += node.textContent
    }
    return out.trim()
  }

  function hidden(el) {
    const style = getComputedStyle(el)
    return style.display === 'none' || style.visibility === 'hidden' || Number.parseFloat(style.opacity) === 0
  }

  /** 直系文本节点的外包矩形（视口坐标），量不到时返回 null。 */
  function textRects(el) {
    const rects = []
    for (const node of el.childNodes) {
      if (node.nodeType !== TEXT_NODE || !node.textContent.trim())
        continue
      const range = document.createRange()
      range.selectNodeContents(node)
      const rect = range.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0)
        rects.push(rect)
    }
    return rects.length ? rects : null
  }

  /** 把视口坐标换成「所有祖先滚动都还原到 0」的绝对坐标。 */
  function absolute(el, rect) {
    let x = rect.left
    let y = rect.top
    for (let parent = el.parentElement; parent; parent = parent.parentElement) {
      x += parent.scrollLeft
      y += parent.scrollTop
    }
    return { x: round(x), y: round(y), w: round(rect.width), h: round(rect.height) }
  }

  function unionBox(rects) {
    const left = Math.min(...rects.map(rect => rect.left))
    const top = Math.min(...rects.map(rect => rect.top))
    const right = Math.max(...rects.map(rect => rect.right))
    const bottom = Math.max(...rects.map(rect => rect.bottom))
    return { left, top, right, bottom, width: right - left, height: bottom - top }
  }

  function styleOf(el) {
    const style = getComputedStyle(el)
    return {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      color: style.color,
      backgroundColor: style.backgroundColor,
    }
  }

  /**
   * 给图标找个配对用的名字：先看自己或祖先的 aria-label / title，
   * 再看祖先里包含的文字（不是只看直系，图标的文字常在兄弟节点里）。
   * 文字太长说明已经走到卡片一层了，再往上没有意义。
   */
  function iconLabel(svg) {
    const LIMIT = 40
    for (let node = svg; node; node = node.parentElement) {
      const label = (node.getAttribute?.('aria-label') ?? node.getAttribute?.('title') ?? '').trim()
      if (label)
        return label
      const text = (node.textContent ?? '').replace(/\s+/g, ' ').trim()
      if (text && text.length <= LIMIT)
        return text
      if (text.length > LIMIT)
        return ''
    }
    return ''
  }

  /**
   * 屏幕外的辅助节点要跳过。有的实现会把量字宽、播报用的节点放到 `position: absolute; top: -20000px`，
   * 它们不是页面上看得见的东西，两边数量不一样也不能算差异。
   */
  function offStage(box) {
    return box.y + box.h <= 0 || box.x + box.w <= 0 || box.w < 2 || box.h < 2
  }

  function record(el, item) {
    if (items.has(el))
      return false
    const className = typeof el.className === 'string' ? el.className.split(/\s+/)[0] : ''
    items.set(el, { ...item, node: className ? `${el.tagName.toLowerCase()}.${className}` : el.tagName.toLowerCase(), order: orderOf.get(el) ?? 0 })
    return true
  }

  /**
   * 算不算「图标」。图表画布也是 `<svg>`，宽高比图标大很多，先按尺寸排掉；
   * 剩下的只收有控件或者有名字的，页面里的装饰小方块（图表图例的色块）两边
   * 用的技术不同（一边 svg、一边 CSS），不能拿来比位置。
   */
  function isIcon(svg) {
    const rect = svg.getBoundingClientRect()
    if (rect.width > ICON_MAX_SIZE || rect.height > ICON_MAX_SIZE)
      return false
    if (svg.closest('button, a, [role="button"], [role="link"], [role="img"], [role="tab"], [role="menuitem"]'))
      return true
    const named = (svg.getAttribute('aria-label') ?? '').trim()
      || (svg.getAttribute('role') ?? '') === 'img'
      || (svg.querySelector('title')?.textContent ?? '').trim()
    return Boolean(named)
  }

  function scan() {
    let added = 0
    for (const el of document.body.querySelectorAll('*')) {
      if (SKIP_TAGS.has(el.tagName) || el.closest('svg'))
        continue
      const text = directText(el)
      if (!text || hidden(el))
        continue
      const rects = textRects(el)
      if (!rects)
        continue
      const box = absolute(el, unionBox(rects))
      if (offStage(box))
        continue
      if (record(el, { kind: 'text', text, box, style: styleOf(el) }))
        added += 1
    }
    for (const svg of document.body.querySelectorAll('svg')) {
      if (hidden(svg) || !isIcon(svg))
        continue
      const box = absolute(svg, svg.getBoundingClientRect())
      if (offStage(box))
        continue
      if (record(svg, { kind: 'icon', text: iconLabel(svg), box, style: {} }))
        added += 1
    }
    return added
  }

  function scrollableElements() {
    const found = []
    for (const el of document.body.querySelectorAll('*')) {
      const style = getComputedStyle(el)
      const scrollsY = /auto|scroll|overlay/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 4
      const scrollsX = /auto|scroll|overlay/.test(style.overflowX) && el.scrollWidth > el.clientWidth + 4
      if (scrollsY || scrollsX)
        found.push(el)
    }
    return found
  }

  const wait = ms => new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

  let scans = 1
  scan()

  const scrollers = scrollableElements().slice(0, MAX_SCROLLERS)
  const containers = [...scrollers]
  const rootScroller = document.scrollingElement
  if (rootScroller && rootScroller.scrollHeight > rootScroller.clientHeight + 4)
    containers.push(rootScroller)

  for (const container of containers) {
    if (scans >= MAX_SCANS)
      break
    const savedTop = container.scrollTop
    const savedLeft = container.scrollLeft
    const maxY = Math.max(0, container.scrollHeight - container.clientHeight)
    const maxX = Math.max(0, container.scrollWidth - container.clientWidth)
    const stepY = Math.max(60, Math.round(container.clientHeight * 0.8))
    const stepX = Math.max(60, Math.round(container.clientWidth * 0.8))
    for (let top = 0; top <= maxY; top += stepY) {
      if (scans >= MAX_SCANS)
        break
      for (let left = 0; left <= maxX; left += stepX) {
        if (scans >= MAX_SCANS)
          break
        container.scrollTop = Math.min(top, maxY)
        container.scrollLeft = Math.min(left, maxX)
        await wait(SETTLE_MS)
        scans += 1
        scan()
      }
    }
    container.scrollTop = savedTop
    container.scrollLeft = savedLeft
  }

  const collected = [...items.values()].sort((a, b) => a.order - b.order)
  return {
    items: collected,
    scanned: scans,
    scrollers: scrollers.length,
    viewport: { width: window.innerWidth, height: window.innerHeight },
  }
}
