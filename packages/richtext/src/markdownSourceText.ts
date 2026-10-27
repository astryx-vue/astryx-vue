// 处理文本的小工具：换行符归一、取第一处换行符、改写全部换行符、内容指纹。

/** Lines without the carriage return before each line feed. */
export function withoutCarriageReturns(text: string): string {
  return text.replace(/\r(?=\n|$)/g, '');
}

/** The first line ending in `text`, or `fallback` when it has none. */
export function lineEndingOf(text: string, fallback: string): string {
  const index = text.indexOf('\n');
  if (index === -1) {
    return fallback;
  }
  return index > 0 && text[index - 1] === '\r' ? '\r\n' : '\n';
}

/** Rewrites every line ending in `text` as `lineEnding`. */
export function withLineEnding(text: string, lineEnding: string): string {
  const lf = text.replace(/\r\n/g, '\n');
  return lineEnding === '\n' ? lf : lf.replace(/\n/g, lineEnding);
}

/**
 * A 64-bit hash of `text`, from two independent 32-bit FNV-1a passes. Only
 * equality matters: it tells an unchanged group from a changed one without
 * storing the canonical Markdown itself.
 */
export function hashOf(text: string): string {
  let first = 0x811c9dc5;
  let second = 0x01000193 ^ text.length;
  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index);
    first = Math.imul(first ^ code, 0x01000193) >>> 0;
    second = Math.imul(second ^ code, 0x5bd1e995) >>> 0;
  }
  return first.toString(36) + second.toString(36).padStart(7, '0');
}
