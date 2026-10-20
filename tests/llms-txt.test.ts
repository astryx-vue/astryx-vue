import type { CatalogEntry } from '../apps/docs/components/demo-infra/demoMeta'
import type { LlmsPage, LlmsPageEntry } from '../apps/docs/scripts/llms-txt'
import { describe, expect, it } from 'vitest'
import {
  decodeEntities,
  fenceBlock,
  fenceFor,
  firstParagraph,
  htmlTableToMarkdown,
  mergeSections,
  splitFenceSegments,
  stripFrontmatter,
  toPlainMarkdown,
  truncate,
  unwrapVueTags,
} from '../apps/docs/scripts/llms-markdown'
import {
  classifyPage,
  collectSections,
  createExpander,
  localizeSourcePath,
  markdownPathFor,
  markdownPathForUrl,
  urlForMarkdownPath,
} from '../apps/docs/scripts/llms-txt'

const noExpand = (): undefined => undefined

describe('frontmatter', () => {
  it('drops the block and keeps scalar fields', () => {
    const { data, body } = stripFrontmatter('---\ntitle: Button\nlayout: component-docs\n---\n\n## Usage\n')
    expect(data).toEqual({ title: 'Button', layout: 'component-docs' })
    expect(body).toBe('\n## Usage\n')
  })

  it('leaves a page without frontmatter alone', () => {
    expect(stripFrontmatter('# Title\n').body).toBe('# Title\n')
  })

  it('does not eat a horizontal rule in the middle of the file', () => {
    const source = '# Title\n\ntext\n\n---\n\nmore\n'
    expect(stripFrontmatter(source).body).toBe(source)
  })
})

describe('fence segments', () => {
  it('keeps the fence markers with the code', () => {
    const segments = splitFenceSegments('before\n\n```vue\n<x />\n```\n\nafter\n')
    expect(segments.map(segment => segment.type)).toEqual(['prose', 'fence', 'prose'])
    expect(segments[1].text).toBe('```vue\n<x />\n```')
  })

  it('does not close a longer fence with a shorter one', () => {
    const segments = splitFenceSegments('````vue\n```\ninner\n```\n````\n\nprose\n')
    expect(segments[0]).toMatchObject({ type: 'fence' })
    expect(segments[1]).toMatchObject({ type: 'prose', text: '\nprose\n' })
  })
})

describe('component tags', () => {
  it('keeps text inside a component and drops the tag', () => {
    expect(unwrapVueTags('<Badge variant="info">New</Badge> and <Icon name="x" />')).toBe('New and ')
  })

  it('never touches tags inside a code fence', () => {
    const source = [
      'prose <Badge>New</Badge>',
      '',
      '```vue',
      '<script setup lang="ts">',
      'import { Button } from \'@astryx-vue/core/Button\'',
      '</script>',
      '<template><Button label="Save" /></template>',
      '```',
    ].join('\n')
    const markdown = toPlainMarkdown(source, noExpand)
    expect(markdown).toContain('prose New')
    expect(markdown).toContain('<script setup lang="ts">')
    expect(markdown).toContain('<template><Button label="Save" /></template>')
  })

  it('drops script setup blocks that live in prose', () => {
    const source = '<script setup lang="ts">\nimport x from \'y\'\n</script>\n\n## Usage\n\ntext\n'
    expect(toPlainMarkdown(source, noExpand)).toBe('## Usage\n\ntext')
  })

  it('protects the text a block expander inserts', () => {
    const expand = (): string => fenceBlock('<Button label="Save" />', 'vue')
    const markdown = toPlainMarkdown('<DemoExample :demo="x" />\n', expand)
    expect(markdown).toContain('<Button label="Save" />')
  })
})

describe('block expanders', () => {
  it('passes the component name and attributes through', () => {
    const calls: Array<{ name: string, attrs: Record<string, string> }> = []
    toPlainMarkdown('<DemoExample\n  :demo="buttonIcon"\n  title="Icon"\n/>\n', (tag) => {
      calls.push(tag)
      return ''
    })
    expect(calls).toEqual([{ name: 'DemoExample', attrs: { demo: 'buttonIcon', title: 'Icon' } }])
  })

  it('turns a demo into a heading, a description, and the source fence', () => {
    const expand = createExpander({
      locale: 'en',
      includeDemoSource: true,
      demos: new Map([['buttonIcon', '<template><Button label="Upload" /></template>']]),
      tokens: [],
      catalog: [],
      unresolvedDemos: new Set(),
    })
    const markdown = toPlainMarkdown(
      '<DemoExample :demo="buttonIcon" title="Icon" description="A leading icon." />\n',
      expand,
    )
    expect(markdown).toBe([
      '### Icon',
      '',
      'A leading icon.',
      '',
      '```vue',
      '<template><Button label="Upload" /></template>',
      '```',
    ].join('\n'))
  })

  it('records a demo it cannot find and keeps the description', () => {
    const unresolvedDemos = new Set<string>()
    const expand = createExpander({
      locale: 'en',
      includeDemoSource: true,
      demos: new Map(),
      tokens: [],
      catalog: [],
      unresolvedDemos,
    })
    expect(toPlainMarkdown('<DemoExample :demo="missing" description="Still here." />\n', expand)).toBe('Still here.')
    expect([...unresolvedDemos]).toEqual(['missing'])
  })

  it('reads the anatomy of a component from the reference data', () => {
    const expand = createExpander({
      locale: 'zh',
      slug: 'button',
      includeDemoSource: false,
      demos: new Map(),
      tokens: [],
      catalog: [],
      unresolvedDemos: new Set(),
    })
    const markdown = toPlainMarkdown('<ComponentAnatomy />\n', expand)
    expect(markdown).toContain('### 结构')
    expect(markdown).toContain('- **')
  })

  it('reads the accessibility checks from the reference data', () => {
    const expand = createExpander({
      locale: 'en',
      slug: 'button',
      includeDemoSource: false,
      demos: new Map(),
      tokens: [],
      catalog: [],
      unresolvedDemos: new Set(),
    })
    const markdown = toPlainMarkdown('<ComponentAccessibility />\n', expand)
    expect(markdown).toContain('### Text label')
    expect(markdown).toContain('- Criterion: 1.4.3 Contrast (Minimum)')
    expect(markdown).toContain('- States: Rest, Hover, Pointer down')
  })

  it('renders only the token sections a page asked for', () => {
    const expand = createExpander({
      locale: 'en',
      includeDemoSource: false,
      demos: new Map(),
      tokens: [
        { name: '--astryx-color-accent', value: 'light-dark(#262626, #ebebeb)' },
        { name: '--astryx-radius-none', value: '0' },
      ],
      catalog: [],
      unresolvedDemos: new Set(),
    })
    const markdown = toPlainMarkdown('<TokenReference locale="en" :sections="[\'radius\']" />\n', expand)
    expect(markdown).toContain('### radius')
    expect(markdown).toContain('| `--astryx-radius-none` | 0 |')
    expect(markdown).not.toContain('color-accent')
  })
})

describe('html tables', () => {
  it('turns the component api table into a markdown table', () => {
    const table = [
      '<table>',
      '<thead><tr><th>Name</th><th>Description</th></tr></thead>',
      '<tbody><tr><td><code>label</code></td><td>Names the action &amp; shows it.</td></tr></tbody>',
      '</table>',
    ].join('\n')
    expect(htmlTableToMarkdown(table)).toBe([
      '| Name | Description |',
      '| --- | --- |',
      '| `label` | Names the action & shows it. |',
    ].join('\n'))
  })

  it('escapes a pipe inside a cell', () => {
    const table = '<table><tr><th>Type</th></tr><tr><td><code>\'a\' | \'b\'</code></td></tr></table>'
    expect(htmlTableToMarkdown(table)).toBe('| Type |\n| --- |\n| `\'a\' \\| \'b\'` |')
  })

  it('drops the wrapper div around the table and leaves no stray html', () => {
    const source = [
      '<div class="component-api-table" role="region">',
      '  <table>',
      '    <tr><th>Name</th></tr>',
      '    <tr><td>variant</td></tr>',
      '  </table>',
      '</div>',
    ].join('\n')
    expect(toPlainMarkdown(source, noExpand)).toBe('| Name |\n| --- |\n| variant |')
  })

  it('leaves a table word written inline in prose alone', () => {
    const source = 'A row must sit inside a section: `<table>` cannot contain a `<tr>` directly.\n'
    expect(toPlainMarkdown(source, noExpand)).toBe(source.trimEnd())
  })
})

describe('helpers', () => {
  it('decodes the entities the docs use', () => {
    expect(decodeEntities('elevation=&quot;med&quot; &amp; &lt;br&gt;')).toBe('elevation="med" & <br>')
  })

  it('sizes the fence to the longest backtick run in the code', () => {
    expect(fenceFor('plain')).toBe('```')
    expect(fenceFor('```')).toBe('````')
    expect(fenceBlock('a\n', 'vue')).toBe('```vue\na\n```')
  })

  it('takes the first paragraph and skips headings and lists', () => {
    expect(firstParagraph('# Title\n\n## Usage\n\n- item\n\n`Button` triggers an action.\n')).toBe('Button triggers an action.')
  })

  it('skips the lead in sentence that ends with a colon', () => {
    expect(firstParagraph('Install both packages:\n\n```sh\npnpm add x\n```\n\nThey publish together.\n')).toBe('They publish together.')
  })

  it('cuts a long sentence on a word boundary', () => {
    expect(truncate('one two three four', 10)).toBe('one two…')
    expect(truncate('short', 10)).toBe('short')
  })
})

describe('merging a component page', () => {
  it('keeps the source title and appends the other tabs', () => {
    const markdown = mergeSections('Button', [
      { markdown: '# Button\n\n## Usage\n\nBody.' },
      { heading: 'Properties', markdown: '## Button Props\n\n| a |' },
      { heading: 'Accessibility', markdown: '### Text label\n\nChecks.' },
    ])
    expect(markdown).toBe(`${[
      '# Button',
      '## Usage',
      'Body.',
      '## Button Props',
      '| a |',
      '## Accessibility',
      '### Text label',
      'Checks.',
    ].join('\n\n')}\n`)
  })
})

describe('paths', () => {
  it('strips the Chinese language prefix and keeps English', () => {
    expect(localizeSourcePath('zh/guide/why.md')).toBe('guide/why.md')
    expect(localizeSourcePath('en/guide/why.md')).toBe('en/guide/why.md')
  })

  it('folds a directory index into a sibling file', () => {
    expect(markdownPathFor('en/components/button/index.md')).toBe('en/components/button.md')
    expect(markdownPathFor('zh/components/button/index.md')).toBe('components/button.md')
    expect(markdownPathFor('en/themes/index.md')).toBe('en/themes.md')
    expect(markdownPathFor('index.md')).toBe('index.md')
  })

  it('merges the component tabs into the overview file', () => {
    expect(markdownPathFor('en/components/button/props.md')).toBe('en/components/button.md')
    expect(markdownPathFor('zh/components/button/accessibility.md')).toBe('components/button.md')
  })

  it('keeps a single page file where it is', () => {
    expect(markdownPathFor('en/guide/dark-mode.md')).toBe('en/guide/dark-mode.md')
    expect(markdownPathFor('zh/playground/frame.md')).toBe('playground/frame.md')
  })

  it('only folds a tab name inside a component folder', () => {
    expect(markdownPathFor('en/guide/accessibility.md')).toBe('en/guide/accessibility.md')
    expect(markdownPathFor('zh/guide/accessibility.md')).toBe('guide/accessibility.md')
  })

  it('turns an output path into a page url', () => {
    expect(urlForMarkdownPath('en/components/button.md')).toBe('/en/components/button')
    expect(urlForMarkdownPath('components/button.md')).toBe('/components/button')
    expect(urlForMarkdownPath('index.md')).toBe('/')
  })

  it('reads a sidebar link, with or without a trailing slash', () => {
    expect(markdownPathForUrl('/en/themes/')).toBe('en/themes.md')
    expect(markdownPathForUrl('/en/guide/why')).toBe('en/guide/why.md')
  })

  it('classifies the page kinds', () => {
    expect(classifyPage('index.md')).toEqual({ kind: 'home' })
    expect(classifyPage('en/index.md')).toEqual({ kind: 'home' })
    expect(classifyPage('en/components/index.md')).toEqual({ kind: 'catalog' })
    expect(classifyPage('zh/components/button/index.md')).toEqual({ kind: 'component', slug: 'button' })
    expect(classifyPage('en/components/button/props.md')).toEqual({ kind: 'component', slug: 'button', tab: 'props' })
    expect(classifyPage('en/guide/why.md')).toEqual({ kind: 'other' })
  })
})

describe('llms.txt sections', () => {
  const catalog: CatalogEntry[] = [
    { slug: 'button', group: 'Action', en: 'Button', zh: '按钮' },
    { slug: 'chat', group: 'Chat', en: 'Chat', zh: '对话' },
  ]

  function pageEntry(markdownPath: string, locale: 'en' | 'zh', description: string): LlmsPageEntry {
    const page: LlmsPage = {
      sourcePath: markdownPath.replace('.md', '/index.md'),
      sitePath: markdownPath.replace('.md', '/index.md'),
      locale,
      markdownPath,
      url: urlForMarkdownPath(markdownPath),
      kind: 'other',
    }
    return { page, title: markdownPath, description, markdown: '' }
  }

  it('lists guide, themes, and components with their summaries', () => {
    const rendered = [
      pageEntry('en/guide/getting-started.md', 'en', 'Install the components and the theme.'),
      pageEntry('en/components/button.md', 'en', '`Button` triggers an action.'),
    ]
    const sections = collectSections('en', rendered, catalog)
    expect(sections.map(section => section.title)).toEqual(['Guide', 'Themes', 'Components'])

    const quickStart = sections[0].entries.find(entry => entry.markdownPath === 'en/guide/getting-started.md')
    expect(quickStart).toMatchObject({ title: 'Quick start', description: 'Install the components and the theme.' })

    expect(sections[2].entries.map(entry => entry.markdownPath)).toEqual([
      'en/components/button.md',
      'en/components/chat.md',
    ])
    expect(sections[0].entries.find(entry => entry.markdownPath === 'en/guide/why.md')?.description).toBe('')
  })

  it('points at the unprefixed Chinese pages', () => {
    const sections = collectSections('zh', [pageEntry('components/button.md', 'zh', '触发操作。')], catalog)
    expect(sections[2].entries[0]).toMatchObject({
      markdownPath: 'components/button.md',
      title: '按钮',
      description: '触发操作。',
    })
  })
})
