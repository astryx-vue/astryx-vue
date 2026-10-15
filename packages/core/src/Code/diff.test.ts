import { describe, expect, it } from 'vitest'
import { diffLineKind, parseFenceLanguage, splitDiffLines } from './diff.js'
import { tokenize } from './tokenizer.js'

describe('diff lines', () => {
  it('classifies unified-diff lines by their first character', () => {
    expect(diffLineKind('+added line')).toBe('added')
    expect(diffLineKind('-removed line')).toBe('removed')
    expect(diffLineKind(' context line')).toBe('context')
    expect(diffLineKind('')).toBe('context')
    expect(diffLineKind('@@ -1,3 +1,4 @@')).toBe('header')
    expect(diffLineKind('--- a/file.ts')).toBe('removed')
    expect(diffLineKind('+++ b/file.ts')).toBe('added')
    expect(diffLineKind('diff --git a/x b/x')).toBe('context')
    expect(diffLineKind('index 83db48f..bf269f4 100644')).toBe('context')
  })

  it('splits the glyph column from the code the base language sees', () => {
    const { kinds, glyphs, content } = splitDiffLines([
      '@@ -1 +1 @@',
      '-  const a = 1;',
      '+  const a = 2;',
      '   const b = 3;',
      '',
    ])
    expect(kinds).toEqual(['header', 'removed', 'added', 'context', 'context'])
    expect(glyphs).toEqual(['', '-', '+', ' ', ''])
    expect(content).toEqual([
      '',
      '  const a = 1;',
      '  const a = 2;',
      '  const b = 3;',
      '',
    ])
  })

  it('treats a ---/+++ pair directly before @@ as a file header anywhere', () => {
    const { kinds, glyphs, content } = splitDiffLines([
      '--- a/x.ts',
      '+++ b/x.ts',
      '@@ -1 +1 @@',
      '--x;',
      '---',
      '+++y;',
      'plain',
      '--- a/y.ts',
      '+++ b/y.ts',
      '@@ -1 +1 @@',
      '-old',
    ])
    expect(kinds).toEqual([
      'header',
      'header',
      'header',
      'removed',
      'removed',
      'added',
      'context',
      'header',
      'header',
      'header',
      'removed',
    ])
    expect(glyphs.slice(0, 7)).toEqual(['', '', '', '-', '-', '+', ''])
    expect(content.slice(3, 7)).toEqual(['-x;', '--', '++y;', 'plain'])
    expect(splitDiffLines(['--- gone', '+++ here', ' same']).kinds).toEqual([
      'removed',
      'added',
      'context',
    ])
    expect(
      splitDiffLines(['@@ -1 +1 @@', '---i;', '+++i;', '@@ -9 +9 @@', ' x']).kinds,
    ).toEqual(['header', 'removed', 'added', 'header', 'context'])
    expect(diffLineKind('--- a/x.ts', true)).toBe('header')
  })

  it('tokenizes the code past the glyph with the base language', () => {
    const { content } = splitDiffLines(['-const a = 1;', '+const a = 2;'])
    const lines = tokenize(content.join('\n'), 'typescript')
    expect(lines[0]?.[0]).toEqual({ type: 'keyword', start: 0, end: 5 })
    expect(lines[1]?.[0]).toEqual({ type: 'keyword', start: 0, end: 5 })
  })

  it('reads fence info strings', () => {
    expect(parseFenceLanguage('diff')).toEqual({ language: 'plaintext', isDiff: true })
    expect(parseFenceLanguage('patch')).toEqual({ language: 'patch', isDiff: false })
    expect(parseFenceLanguage('diff-tsx')).toEqual({ language: 'tsx', isDiff: true })
    expect(parseFenceLanguage('tsx')).toEqual({ language: 'tsx', isDiff: false })
    expect(parseFenceLanguage(undefined)).toEqual({ language: 'plaintext', isDiff: false })
  })
})
