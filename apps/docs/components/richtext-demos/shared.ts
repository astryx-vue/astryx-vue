import { markdownToEditorStateJSON } from '@astryx-vue/richtext'

/** 所有富文本示例共用的起始内容：一段 Markdown，转成编辑器状态。 */
export const seed = markdownToEditorStateJSON([
  '# Release notes',
  '',
  'A paragraph with **bold**, *italic*, `inline code` and a [link](https://example.com).',
  '',
  '- [ ] Check the changelog',
  '- [x] Bump the version',
  '',
  '> Quotes keep their own role for screen readers.',
  '',
  '```js',
  'const shipped = true',
  '```',
  '',
  '| Platform | Status |',
  '| --- | --- |',
  '| npm | ready |',
].join('\n'))
