/**
 * 字重探针：让 CSS 读到图标周围文字的字重。
 *
 * CSS 没法直接查询 `font-weight`（容器样式查询、`if()` 和 `inherit()` 只看自定义属性），
 * 字体却可以。这个只有 380 字节的字体没有可见字形，有一条变化轴（wght 1-1000），
 * 「0」字形的字宽是每 1000 单位的 em 里 1000 + 字重。探针作为元素的第一个字体时，
 * `1ch` = (1000 + 字重) / 1000 em；宽 `1ch` 的容器把字重变成容器查询能判断的宽度
 * （`width >= 1.45em` 就是字重 >= 450），不用做长度相除。
 *
 * 所有可变字体引擎都支持变化字宽；x-height（MVAR）却不是每个引擎都应用。1000 单位的偏移
 * 让后备字体（「0」约 0.5-0.6em）落在所有判断范围之外，所以探针解码之前图标用后备字重。
 * 字体由上游的 `generate-weight-probe-font.py` 生成，这里直接带着生成的字节。
 */

const WEIGHT_PROBE_FAMILY = 'AstryxWeightProbe'

const WEIGHT_PROBE_WOFF2
  = 'd09GMgABAAAAAAF8AA0AAAAAA3gAAAEqAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP0hWQVJCBmAANC8kChQ0MDgBNgIkAwgLBgAEIAWBHwcmG6wCSJ4Dbju8irW92Oh6kugpxBHF73Wz914orQn1haE0i7NEfoVGyjhDMSqx3PQe4nGGeCocqpVjz8Tigex/gProjx0HFGASWG5hEFKioUWYlo2QwKAbOy9qONhMS92/KOAAAAQbggtRMzPAEwWlFALzlgGfTGkTXVMAjyUGQ/uHEPTdgELDgSY40N2g64JhQcIE3t9R4gArn3EygMg37R8CFOgIGjqgg9CSdQkQBJyp2oftsbBjaTSDpdETjGrevv+jyvtDEL54adqir/D2Dz97+oCOIoKmQGj/MJkCC0WwFwiC0hCqWQCWfCAQuwgo3a5AWHKoSV8Vd84vlxX3Zdjw/twP3bo8UEXd1V44y2GYwzD0Bp3VwhJKxRIDrVPzhGbSYAAJZjW2DwA='

/**
 * Whether the document already holds the probe face. The document's font set
 * is the record, so every copy of this module, a swizzled one too, adds the
 * face once.
 */
function hasWeightProbe(fonts: FontFaceSet): boolean {
  for (const face of fonts) {
    if (face.family.replace(/["']/g, '') === WEIGHT_PROBE_FAMILY) {
      return true
    }
  }
  return false
}

/**
 * Adds the probe font to `doc.fonts` once per document: the page, an iframe
 * or a pop-out window. Safe to call repeatedly; until the font decodes, icons
 * use their fallback weight.
 */
export function registerWeightProbe(doc: Document): void {
  const FontFaceInView = doc.defaultView?.FontFace
  if (FontFaceInView == null || hasWeightProbe(doc.fonts)) {
    return
  }
  const bytes = Uint8Array.from(atob(WEIGHT_PROBE_WOFF2), c => c.charCodeAt(0))
  const face = new FontFaceInView(WEIGHT_PROBE_FAMILY, bytes, {
    weight: '1 1000',
  })
  doc.fonts.add(face)
  face.load().catch(() => {
    // Without the probe, icons keep their fallback weight.
  })
}
