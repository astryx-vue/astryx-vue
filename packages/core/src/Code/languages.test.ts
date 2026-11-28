import type { CodeLanguage } from './grammar.js'
import { describe, expect, it } from 'vitest'
import {
  createCodeLanguage,
  isCodeLanguage,
  languageKey,
  languageLabel,
  listedLanguage,
  listedLanguageForFile,
  sameCodeLanguageList,
} from './grammar.js'
import { dockerfile } from './languages/dockerfile/index.js'
import { graphql } from './languages/graphql/index.js'
import { java } from './languages/java/index.js'
import { lua } from './languages/lua/index.js'
import { objectiveC } from './languages/objective-c/index.js'
import { powershell } from './languages/powershell/index.js'
import { ruby } from './languages/ruby/index.js'
import { thrift } from './languages/thrift/index.js'
import { toml } from './languages/toml/index.js'
import { tokenize } from './tokenizer.js'

/** 代码里被标成各种类型的文字。 */
function painted(code: string, language: string | CodeLanguage): Map<string, Set<string>> {
  const lines = code.split('\n')
  const out = new Map<string, Set<string>>()
  tokenize(code, language).forEach((tokens, index) => {
    for (const token of tokens) {
      const texts = out.get(token.type) ?? new Set<string>()
      texts.add(lines[index]!.slice(token.start, token.end))
      out.set(token.type, texts)
    }
  })
  return out
}

interface Case {
  ids: Array<string | CodeLanguage>
  code: string
  comment?: string
  string?: string
  number?: string
  keyword: string
}

const NEW_LANGUAGES: Case[] = [
  { ids: ['c', 'h'], code: '#include <stdio.h>\n// c\nint n = 42; char *s = "x";', comment: '// c', string: '"x"', number: '42', keyword: 'int' },
  { ids: ['cpp', 'c++', 'cc', 'cxx', 'hpp', 'hh'], code: '// c\nclass A { int n = 42; const char *s = "x"; };', comment: '// c', string: '"x"', number: '42', keyword: 'class' },
  { ids: ['sql'], code: '-- c\nSELECT name FROM t WHERE n = 42 AND s = \'x\';', comment: '-- c', string: '\'x\'', number: '42', keyword: 'SELECT' },
  { ids: ['rust', 'rs'], code: '// c\nfn main() { let n = 42; let s = "x"; }', comment: '// c', string: '"x"', number: '42', keyword: 'fn' },
  { ids: ['kotlin', 'kt', 'kts'], code: '// c\nfun main() { val n = 42; val s = "x" }', comment: '// c', string: '"x"', number: '42', keyword: 'fun' },
  { ids: ['swift'], code: '// c\nfunc main() { let n = 42; let s = "x" }', comment: '// c', string: '"x"', number: '42', keyword: 'func' },
  { ids: ['go', 'golang'], code: '// c\nfunc main() { n := 42; s := "x" }', comment: '// c', string: '"x"', number: '42', keyword: 'func' },
  { ids: [graphql], code: '# c\nquery Q($id: ID) { user(id: $id) { name } }', comment: '# c', keyword: 'query' },
  { ids: [java], code: '// c\npublic class A { int n = 42; String s = "x"; }', comment: '// c', string: '"x"', number: '42', keyword: 'class' },
  { ids: [lua], code: '-- c\nlocal n = 42 local s = "x"', comment: '-- c', string: '"x"', number: '42', keyword: 'local' },
  { ids: [objectiveC], code: '// c\n@interface A : NSObject\nint n = 42; NSString *s = @"x";', comment: '// c', string: '@"x"', number: '42', keyword: '@interface' },
  { ids: [powershell], code: '# c\nfunction Get-Thing { $n = 42; "x" }', comment: '# c', string: '"x"', number: '42', keyword: 'function' },
  { ids: [ruby], code: '# c\ndef f; n = 42; s = "x"; end', comment: '# c', string: '"x"', number: '42', keyword: 'def' },
  { ids: [thrift], code: '// c\nstruct User { 1: required string name = "x"; 2: i32 n = 42 }', comment: '// c', string: '"x"', number: '42', keyword: 'struct' },
  { ids: [toml], code: '# c\n[server]\nname = "x"\nport = 42', comment: '# c', string: '"x"', number: '42', keyword: '' },
  { ids: [dockerfile], code: '# c\nFROM node:20 AS build\nENV NAME="x"', comment: '# c', string: '"x"', keyword: 'FROM' },
]

describe('new built-in identifiers and language modules', () => {
  for (const entry of NEW_LANGUAGES) {
    for (const id of entry.ids) {
      const name = typeof id === 'string' ? id : id.name
      it(`paints ${name}`, () => {
        const types = painted(entry.code, id)
        if (entry.comment != null)
          expect(types.get('comment')?.has(entry.comment), 'comment').toBe(true)
        if (entry.string != null)
          expect(types.get('string')?.has(entry.string), 'string').toBe(true)
        if (entry.number != null)
          expect(types.get('number')?.has(entry.number), 'number').toBe(true)
        if (entry.keyword !== '')
          expect([...(types.get('keyword') ?? [])].some(text => text.toLowerCase() === entry.keyword.toLowerCase()), 'keyword').toBe(true)
      })
    }
  }

  it('does not let an identifier string reach a module', () => {
    expect(tokenize('struct User {}', 'thrift')).toEqual([])
    expect(tokenize('struct User {}', thrift)[0]?.length).toBeGreaterThan(0)
  })

  it('leaves unknown identifiers plain', () => {
    expect(tokenize('whatever 1', 'brainfuck')).toEqual([])
  })
})

describe('language values', () => {
  it('carry a name, identifiers, file extensions and file names', () => {
    expect(isCodeLanguage(dockerfile)).toBe(true)
    expect(dockerfile.name).toBe('dockerfile')
    expect(dockerfile.identifiers).toContain('docker')
    expect(dockerfile.fileNames).toEqual(['Dockerfile', 'Containerfile'])
    expect(ruby.fileExtensions).toContain('gemspec')
    expect(isCodeLanguage('ruby')).toBe(false)
    expect(isCodeLanguage(null)).toBe(false)
  })

  it('label with their name and reflect their first identifier', () => {
    expect(languageLabel('ts')).toBe('ts')
    expect(languageLabel(objectiveC)).toBe('objective-c')
    expect(languageKey('ts')).toBe('ts')
    expect(languageKey(objectiveC)).toBe('objective-c')
  })

  it('createCodeLanguage makes a language from a tokenize function', () => {
    const zig = createCodeLanguage({
      name: 'zig',
      identifiers: ['zig'],
      fileExtensions: ['zig'],
      tokenize: code => [{ type: 'keyword', start: code.indexOf('pub'), end: code.indexOf('pub') + 3 }],
    })
    expect(isCodeLanguage(zig)).toBe(true)
    expect(zig.fileNames).toEqual([])
    expect(tokenize('a\npub fn', zig)).toEqual([[], [{ type: 'keyword', start: 0, end: 3 }]])
  })

  it('a listed value claims a word ahead of an earlier one, and a file by name or extension', () => {
    const first = createCodeLanguage({ name: 'first', identifiers: ['x'], tokenize: () => [] })
    const second = createCodeLanguage({ name: 'second', identifiers: ['x', 'y'], fileExtensions: ['sec'], fileNames: ['SECFILE'], tokenize: () => [] })
    expect(listedLanguage([first, second], 'x')).toBe(second)
    expect(listedLanguage([first, second], 'q')).toBeUndefined()
    expect(listedLanguage(undefined, 'x')).toBeUndefined()
    expect(listedLanguageForFile([first, second], 'a.sec', 'sec')).toBe(second)
    expect(listedLanguageForFile([first, second], 'SECFILE', null)).toBe(second)
    expect(sameCodeLanguageList([first, second], [first, second])).toBe(true)
    expect(sameCodeLanguageList([first], [first, second])).toBe(false)
    expect(sameCodeLanguageList(undefined, undefined)).toBe(true)
  })
})
