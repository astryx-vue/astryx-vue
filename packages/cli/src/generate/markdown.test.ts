import { describe, expect, it } from 'vitest'
import { extractPage, firstSentence, paragraphContaining } from './markdown.ts'

const PAGE = `---
title: Button
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

\`Button\` triggers an action. Set \`label\` to name the action.

\`\`\`vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>
\`\`\`

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Reserve primary for the main action. |
| <Badge variant="error">Don't</Badge> | Do not use a button for navigation. |

## Examples

<DemoExample title="Sizes" />
`

const PROPS = `---
title: Button
---

## Button Props

<div class="component-api-table">
  <table>
    <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>required</td><td>Names the action.</td></tr>
      <tr><td><code>variant</code></td><td><code>&#x27;primary&#x27; | &#x27;secondary&#x27;</code></td><td><code>&#x27;secondary&#x27;</code></td><td>Visual hierarchy.</td></tr>
    </tbody>
  </table>
</div>

## Async actions

- \`clickAction\` can return a Promise.
`

describe('markdown extraction', () => {
  it('keeps the usage paragraph, the import, and the badge text', () => {
    const page = extractPage(PAGE, 'Button')
    expect(page.summary).toBe('`Button` triggers an action. Set `label` to name the action.')
    expect(page.importPath).toBe('@astryx-vue/core/Button')
    expect(page.exportName).toBe('Button')
    expect(page.usage).toContain('import { Button }')
    expect(page.usage).not.toContain('ComponentAnatomy')
    expect(page.practices).toEqual([
      { guidance: 'Do', text: 'Reserve primary for the main action.' },
      { guidance: 'Don\'t', text: 'Do not use a button for navigation.' },
    ])
    expect(page.notes.some(note => note.text.includes('DemoExample'))).toBe(false)
  })

  it('reads HTML prop tables and the prose that follows them', () => {
    const page = extractPage(PROPS, 'Button')
    expect(page.props[0]?.rows[0]).toEqual({ name: '`label`', type: '`string`', default: 'required', description: 'Names the action.' })
    expect(page.props[0]?.rows[1]?.type).toBe('`\'primary\' | \'secondary\'`')
    expect(page.props[0]?.rows[1]?.default).toBe('`\'secondary\'`')
    expect(page.notes.map(note => note.heading)).toContain('Async actions')
  })

  it('skips an import-only usage paragraph and keeps the next real sentence', () => {
    const page = extractPage(`## Usage

Import the component from its dedicated entry. Structural styles are loaded automatically.

\`\`\`vue
import { Avatar } from '@astryx-vue/core/Avatar'
\`\`\`

A photo, initials, or a fallback icon stands in for a person.

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Always provide a name. |
`, 'Avatar')
    expect(page.summary).toBe('A photo, initials, or a fallback icon stands in for a person.')
    expect(page.summary).not.toContain('dedicated entry')
  })

  it('uses the first practice when the usage section is only the import boilerplate', () => {
    const page = extractPage(`## Usage

Import the component from its dedicated entry. The component loads its structural styles.

\`\`\`vue
<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

<template>
  <Badge variant="success">Completed</Badge>
</template>
\`\`\`

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Always provide \`name\` for fallback text. |
`, 'Badge')
    expect(page.summary).toBe('Always provide `name` for fallback text.')
  })

  it('keeps a dedicated-entry sentence that also states how to use the component', () => {
    const page = extractPage('## Usage\n\nImport `TabList` and `Tab` from their dedicated entry and control selection with `v-model:value`.\n', 'TabList')
    expect(page.summary).toContain('v-model:value')
  })

  it('finds a convention paragraph from a guide page', () => {
    const paragraph = paragraphContaining('# Guide\n\nImport each component from its own subpath. That entry loads the matching structural styles.\n', 'own subpath')
    expect(paragraph).toContain('own subpath')
    expect(firstSentence(paragraph)).toBe('Import each component from its own subpath.')
  })
})
