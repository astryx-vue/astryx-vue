import { mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { MANAGED_BLOCK_END, MANAGED_BLOCK_START } from './agents.ts'
import { runCli } from './cli.ts'

/**
 * Every command except `init` is read-only. This test proves it the only way a
 * reader can trust: it walks the whole project before and after, and compares
 * every path, every byte, and the modification time.
 */

interface Snapshot {
  files: Map<string, string>
  modified: Map<string, number>
}

async function snapshot(root: string): Promise<Snapshot> {
  const files = new Map<string, string>()
  const modified = new Map<string, number>()
  const pending = ['']
  while (pending.length > 0) {
    const relative = pending.shift()!
    for (const entry of await readdir(join(root, relative), { withFileTypes: true })) {
      const child = relative ? `${relative}/${entry.name}` : entry.name
      if (entry.isDirectory()) {
        pending.push(child)
        continue
      }
      files.set(child, await readFile(join(root, child), 'utf8'))
      modified.set(child, (await stat(join(root, child))).mtimeMs)
    }
  }
  return { files, modified }
}

async function scaffold(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'astryx-vue-readonly-'))
  const files: Record<string, string> = {
    'package.json': JSON.stringify({
      name: 'demo',
      packageManager: 'pnpm@9.12.0',
      dependencies: { '@astryx-vue/core': '0.3.0', '@astryx-vue/themes': '0.4.0', 'vue': '^3.5.0' },
    }, null, 2),
    'pnpm-lock.yaml': 'lockfileVersion: 9\n',
    'src/main.ts': 'import \'@astryx-vue/themes/neutral.css\'\n',
    'src/App.vue': [
      '<script setup lang="ts">',
      'import { TextInput } from \'@astryx-vue/core/TextInput\'',
      '</script>',
      '',
      '<template>',
      '  <TextInput label="Name" labelHidden />',
      '</template>',
      '',
    ].join('\n'),
    'index.html': '<html data-astryx-theme="neutral"></html>\n',
    'AGENTS.md': `# Team notes\n\nKeep this paragraph.\n\n${MANAGED_BLOCK_START}\nstale block\n${MANAGED_BLOCK_END}\n\n## After\n\nKeep this too.\n`,
  }
  for (const [path, content] of Object.entries(files)) {
    await mkdir(join(dir, path, '..'), { recursive: true })
    await writeFile(join(dir, path), content)
  }
  return dir
}

const READ_ONLY_COMMANDS: string[][] = [
  ['component', '--list'],
  ['component', 'Button'],
  ['composable', 'useClipboard'],
  ['docs'],
  ['docs', 'guide/dark-mode', '--depth', '2'],
  ['search', 'button'],
  ['search', 'login', '--type', 'template', '--json'],
  ['template', '--list'],
  ['template', 'login-card'],
  ['template', 'login-card', '--skeleton'],
  ['build', 'login page with SSO'],
  ['manifest', '--json'],
  ['theme'],
  ['theme', 'butter'],
  ['upgrade'],
  ['upgrade', '--json'],
  ['doctor'],
  ['doctor', '--json'],
]

describe('read-only commands', () => {
  it('leave every file exactly as it was', async () => {
    const cwd = await scaffold()
    try {
      const before = await snapshot(cwd)
      for (const argv of READ_ONLY_COMMANDS) {
        const result = await runCli(argv, { cwd })
        // A command may fail (an older core, a missing option): what matters is
        // that it wrote nothing.
        expect(result.stderr).not.toContain('ENOENT')
      }
      const after = await snapshot(cwd)
      expect([...after.files.keys()]).toEqual([...before.files.keys()])
      for (const [path, content] of before.files)
        expect(after.files.get(path), `${path} changed`).toBe(content)
      for (const [path, mtime] of before.modified)
        expect(after.modified.get(path), `${path} was touched`).toBe(mtime)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  }, 60_000)

  it('lets init change the managed block and nothing else', async () => {
    const cwd = await scaffold()
    try {
      const before = await snapshot(cwd)
      const result = await runCli(['init'], { cwd })
      expect(result.exitCode).toBe(0)
      const after = await snapshot(cwd)

      expect([...after.files.keys()].sort()).toEqual([...before.files.keys()].sort())
      for (const [path, content] of before.files) {
        if (path === 'AGENTS.md')
          continue
        expect(after.files.get(path), `${path} changed`).toBe(content)
        expect(after.modified.get(path), `${path} was touched`).toBe(before.modified.get(path))
      }

      const updated = after.files.get('AGENTS.md') ?? ''
      expect(updated.startsWith('# Team notes\n\nKeep this paragraph.\n\n')).toBe(true)
      expect(updated.trimEnd().endsWith('Keep this too.')).toBe(true)
      expect(updated).toContain(MANAGED_BLOCK_START)
      expect(updated).toContain(MANAGED_BLOCK_END)
      expect(updated).not.toContain('stale block')
      expect(updated.match(new RegExp(MANAGED_BLOCK_START, 'g'))).toHaveLength(1)
    }
    finally {
      await rm(cwd, { recursive: true, force: true })
    }
  }, 60_000)
})
