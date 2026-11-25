/**
 * 构造带 Unicode 属性转义（`\p{…}`）的正则。
 *
 * 这类正则不写成字面量：没有设 browserslist 或目标浏览器不支持属性转义时，Babel 的
 * transform-unicode-property-regex 会改写 `\p{…}` 字面量，而 Next.js 自带的那份缺少所需的
 * Unicode 数据，源码构建会报 "Unknown property"。在运行时构造就没有字面量可改写。
 * `unicodePropertyEscapes.test.ts` 检查源码里没有这样的字面量。
 */
export function unicodeRegExp(pattern: string, flags = 'u'): RegExp {
  return new RegExp(pattern, flags)
}
