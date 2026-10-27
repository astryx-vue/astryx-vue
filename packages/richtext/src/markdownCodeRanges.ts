// 把 Markdown 源码切成「代码区」的范围：围栏代码块和行内代码。扫描字符实体、反斜杠转义、
// 链接目标之前都先问这里，代码里面出现的字符不参与外面那套规则。

const FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})/;

/**
 * The ranges of `text` that are code: fenced code blocks, and code spans,
 * where a backtick run opens a span only if a later run of the same length
 * closes it (CommonMark 0.31). One scan collects the runs; runs of each length
 * are searched by position, so the whole is O(n log n).
 */
export function codeRanges(text: string): Array<readonly [number, number]> {
  const {fenced, spans} = codeRangesByKind(text);
  return [...fenced, ...spans].sort((a, b) => a[0] - b[0]);
}

/** The fenced code blocks of `text`, and its code spans, each in order. */
export function codeRangesByKind(text: string): {
  fenced: Array<readonly [number, number]>;
  spans: Array<readonly [number, number]>;
} {
  const ranges: Array<readonly [number, number]> = [];
  // Fenced code blocks, line by line.
  let lineStart = 0;
  let fence: {readonly marker: string; readonly start: number} | null = null;
  while (lineStart <= text.length) {
    const lineEnd = text.indexOf('\n', lineStart);
    const end = lineEnd === -1 ? text.length : lineEnd;
    const line = text.slice(lineStart, end);
    if (fence == null) {
      const open = FENCE_OPEN.exec(line);
      if (open != null) {
        fence = {marker: open[1], start: lineStart};
      }
    } else if (
      new RegExp(
        `^ {0,3}\\${fence.marker[0]}{${fence.marker.length},}[ \\t]*$`,
      ).test(line)
    ) {
      ranges.push([fence.start, end]);
      fence = null;
    }
    if (lineEnd === -1) {
      break;
    }
    lineStart = lineEnd + 1;
  }
  if (fence != null) {
    ranges.push([fence.start, text.length]);
  }
  const fencedCount = ranges.length;
  // Code spans, outside fenced code. A backtick run is a string of backticks
  // with no backtick on either side. Backslashes are literal inside a code
  // span, so they never hide a closing run; an odd number of backslashes
  // before a run only makes its first backtick literal, so the rest of the
  // run (if any) may still open a span.
  const runs: Array<{readonly start: number; readonly length: number}> = [];
  let index = 0;
  let fenceIndex = 0;
  while (index < text.length) {
    const current = ranges[fenceIndex];
    if (current != null && index >= current[0]) {
      index = current[1];
      fenceIndex++;
      continue;
    }
    if (text[index] === '`') {
      let end = index;
      while (text[end] === '`') {
        end++;
      }
      runs.push({start: index, length: end - index});
      index = end;
      continue;
    }
    index++;
  }
  // Each run's position in the list of runs of its length, for finding the
  // next run of a given length after a point by binary search.
  const byLength = new Map<number, Array<number>>();
  for (const run of runs) {
    const starts = byLength.get(run.length) ?? [];
    starts.push(run.start);
    byLength.set(run.length, starts);
  }
  const nextRunAfter = (length: number, after: number): number | null => {
    const starts = byLength.get(length);
    if (starts == null) {
      return null;
    }
    let low = 0;
    let high = starts.length;
    while (low < high) {
      const middle = (low + high) >> 1;
      if (starts[middle] < after) {
        low = middle + 1;
      } else {
        high = middle;
      }
    }
    return starts[low] ?? null;
  };
  let resumeAt = 0;
  for (const run of runs) {
    if (run.start < resumeAt) {
      continue;
    }
    let backslashes = 0;
    while (text[run.start - 1 - backslashes] === '\\') {
      backslashes++;
    }
    const isEscaped = backslashes % 2 === 1;
    const openStart = isEscaped ? run.start + 1 : run.start;
    const openLength = isEscaped ? run.length - 1 : run.length;
    if (openLength === 0) {
      continue;
    }
    const closer = nextRunAfter(openLength, run.start + run.length);
    if (closer == null) {
      continue;
    }
    ranges.push([openStart, closer + openLength]);
    resumeAt = closer + openLength;
  }
  return {
    fenced: ranges.slice(0, fencedCount),
    spans: ranges.slice(fencedCount).sort((a, b) => a[0] - b[0]),
  };
}
