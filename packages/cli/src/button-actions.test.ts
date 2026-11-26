import type { SourceFile } from './project.ts'
import { describe, expect, it } from 'vitest'
import { findButtonsWithoutAction } from './button-actions.ts'

const IMPORT_BUTTON = 'import { Button } from \'@astryx-vue/core/Button\'\n'

/** A component file with `script` in `<script setup>` and `template` as its markup. */
function sfc(template: string, script = IMPORT_BUTTON): string {
  return `<script setup lang="ts">\n${script}</script>\n\n<template>\n${template}\n</template>\n`
}

function scan(files: Record<string, string>) {
  const list: SourceFile[] = Object.entries(files).map(([path, text]) => ({ path, text }))
  return findButtonsWithoutAction(list)
}

describe('findButtonsWithoutAction', () => {
  it('names a Core button with no action, an empty handler, or a link that goes nowhere', () => {
    const result = scan({
      'src/Toolbar.vue': sfc([
        '  <div class="bar">',
        '    <Button label="Save" />',
        '    <Button label="Undo" @click="() => {}" />',
        '    <Button label="Docs" href="#" />',
        '    <Button label="Run" :click-action="async () => {}" />',
        '  </div>',
      ].join('\n')),
    })
    expect(result.found).toEqual([
      { file: 'src/Toolbar.vue', line: 7, component: 'Button', label: 'Save', note: null },
      { file: 'src/Toolbar.vue', line: 8, component: 'Button', label: 'Undo', note: 'empty handler' },
      { file: 'src/Toolbar.vue', line: 9, component: 'Button', label: 'Docs', note: 'link to #' },
      { file: 'src/Toolbar.vue', line: 10, component: 'Button', label: 'Run', note: 'empty handler' },
    ])
  })

  it('leaves a button that acts, and one it cannot judge', () => {
    const result = scan({
      'src/Form.vue': sfc([
        '  <form @submit.prevent="save">',
        '    <Button label="A" @click="save" />',
        '    <Button label="B" href="/docs" />',
        '    <Button label="C" type="submit" />',
        '    <Button label="D" :click-action="save" />',
        '    <Button label="E" v-bind="props" />',
        '    <Button label="F" ref="trigger" />',
        '    <Button label="G" is-disabled />',
        '    <Button label="H" tooltip="Soon" />',
        '    <Button label="I" @pointerdown="start" />',
        '    <Button label="J" v-my-directive />',
        '    <Button label="K" :type="kind" />',
        '    <Button label="L"><slot /></Button>',
        '    <Button label="M"><MyThing /></Button>',
        '  </form>',
      ].join('\n')),
    })
    expect(result.found).toEqual([])
  })

  it('judges no button inside something that may act on a press', () => {
    const result = scan({
      'src/Menu.vue': sfc([
        '  <div @click="toggle"><Button label="A" /></div>',
        '  <Popover><template #trigger><Button label="B" /></template></Popover>',
        '  <a href="/x"><Button label="C" /></a>',
        '  <div role="button"><Button label="D" /></div>',
        '  <my-widget><Button label="E" /></my-widget>',
        '  <AppCard><Button label="F" /></AppCard>',
      ].join('\n'), `${IMPORT_BUTTON}import { Popover } from '@astryx-vue/core/Popover'\nimport AppCard from './AppCard.vue'\n`),
    })
    expect(result.found).toEqual([])
  })

  it('looks through Core layout, Vue wrappers, icons and plain HTML', () => {
    const result = scan({
      'src/Panel.vue': sfc([
        '  <Card>',
        '    <Stack>',
        '      <Transition>',
        '        <section role="region">',
        '          <Button label="Open"><template #icon><Icon name="add" /></template></Button>',
        '          <Button label="Close"><PencilIcon /></Button>',
        '        </section>',
        '      </Transition>',
        '    </Stack>',
        '  </Card>',
      ].join('\n'), `${IMPORT_BUTTON}import { Card, Icon, Stack } from '@astryx-vue/core'\nimport PencilIcon from '~icons/carbon/edit'\n`),
    })
    expect(result.found.map(button => button.label)).toEqual(['Open', 'Close'])
  })

  it('follows each place the app renders the component that holds the button', () => {
    const save = sfc('  <Button label="Save" />')
    const plain = scan({
      'src/SaveBar.vue': save,
      'src/App.vue': sfc('  <main><SaveBar /></main>', 'import SaveBar from \'./SaveBar.vue\'\n'),
      'src/main.ts': 'import { createApp } from \'vue\'\nimport App from \'./App.vue\'\n\ncreateApp(App).mount(\'#app\')\n',
    })
    expect(plain.found.map(button => button.file)).toEqual(['src/SaveBar.vue'])

    const listened = scan({
      'src/SaveBar.vue': save,
      'src/App.vue': sfc('  <main><save-bar @click="save" /></main>', 'import SaveBar from \'./SaveBar.vue\'\n'),
    })
    expect(listened.found).toEqual([])

    const wrapped = scan({
      'src/SaveBar.vue': save,
      'src/Page.vue': sfc('  <div @click="save"><SaveBar /></div>', 'import SaveBar from \'./SaveBar.vue\'\n'),
      'src/App.vue': sfc('  <Page />', 'import Page from \'./Page.vue\'\n'),
    })
    expect(wrapped.found).toEqual([])

    const routed = scan({
      'src/SaveBar.vue': save,
      'src/router.ts': 'import SaveBar from \'./SaveBar.vue\'\nexport const routes = [{ path: \'/\', component: SaveBar }]\n',
    })
    expect(routed.found).toEqual([])

    const lazy = scan({
      'src/pages/SaveBar.vue': save,
      // eslint-disable-next-line no-template-curly-in-string
      'src/router.ts': 'export const routes = [{ path: \'/\', component: () => import(`./pages/${name}.vue`) }]\n',
    })
    expect(lazy.found).toEqual([])

    const autoImported = scan({
      'src/SaveBar.vue': save,
      'src/App.vue': '<template>\n  <button @click="go"><SaveBar /></button>\n</template>\n',
    })
    expect(autoImported.found).toEqual([])
  })

  it('judges no button when the app listens for a press through the DOM', () => {
    const files = {
      'src/Toolbar.vue': sfc('  <Button label="Save" />'),
      'src/shortcuts.ts': 'document.addEventListener(\'click\', onPress)\n',
    }
    expect(scan(files)).toMatchObject({ found: [], domListener: 'src/shortcuts.ts:1' })
    expect(scan({ ...files, 'src/shortcuts.ts': 'window.addEventListener(\'resize\', onResize)\n' }).found).toHaveLength(1)
  })

  it('accepts # in an app that routes by the hash, and skips test files', () => {
    const files = {
      'src/Nav.vue': sfc('  <Button label="Home" href="#" />'),
      'src/router.ts': 'import { createRouter, createWebHashHistory } from \'vue-router\'\n',
      'src/__tests__/Fixture.vue': sfc('  <Button label="Test" />'),
    }
    expect(scan(files).found).toEqual([])
  })

  it('reads an IconButton and a renamed import, and ignores a Button from elsewhere', () => {
    const result = scan({
      'src/Bar.vue': sfc(
        '  <AstryxIconButton label="Edit" icon="edit" />\n  <Button label="Other" />',
        'import { IconButton as AstryxIconButton } from \'@astryx-vue/core\'\nimport Button from \'./MyButton.vue\'\n',
      ),
    })
    expect(result.found).toEqual([{ file: 'src/Bar.vue', line: 7, component: 'IconButton', label: 'Edit', note: null }])
  })
})
