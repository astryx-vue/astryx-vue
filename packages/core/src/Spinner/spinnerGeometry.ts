const RESOLVED_GEOMETRY = ['--_spinner-ring-diameter', '--_spinner-ring-stroke'] as const

let registered = false

/**
 * 把圆环的直径和描边登记成长度。
 * 这样主题写成 `0` 时，它是 0px，而不是把 `calc()` 里的加法变成非法值。
 * 公开变量不登记，避免整份文档都带着一个初始值。
 */
export function registerSpinnerGeometry(): void {
  if (registered || typeof CSS === 'undefined' || typeof CSS.registerProperty !== 'function')
    return
  registered = true
  for (const name of RESOLVED_GEOMETRY) {
    try {
      CSS.registerProperty({
        name,
        syntax: '<length>',
        inherits: true,
        initialValue: '0px',
      })
    }
    catch {
      // 已经登记过。重复登记会抛错，原来的登记仍然有效。
    }
  }
}
