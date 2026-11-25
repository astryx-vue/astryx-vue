/**
 * Which status role each component paints with.
 *
 * A strong fill (`--color-<status>`) carries `--color-on-<status>`; a pale fill
 * carries `--color-on-<status>-muted`; text, icons, and borders on the page
 * read `--color-text-<status>`, `--color-icon-<status>`, and
 * `--color-border-<status>`. Status fills keep a visible boundary in forced
 * colors.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (path: string): string => readFileSync(join(root, path), 'utf8')
const core = (name: string): string => read(`packages/core/styles/${name}.css`)
const neutral = (name: string): string => read(`packages/themes/neutral/${name}.css`)

const FIELD_STATUSES = ['success', 'warning', 'error'] as const

describe('status role consumers', () => {
  it('paint icons with the icon roles', () => {
    for (const status of [...FIELD_STATUSES, 'info'])
      expect(neutral('icon')).toContain(`--astryx-icon-${status}-foreground: var(--astryx-color-icon-${status});`)
    expect(core('icon')).toContain(`.astryx-icon[data-color='info']`)
    for (const status of FIELD_STATUSES)
      expect(core('stepper')).toContain(`color: var(--astryx-color-icon-${status},`)
  })

  it('draw input status borders with the border roles and status messages with the pale-fill content', () => {
    for (const status of FIELD_STATUSES) {
      expect(neutral('input')).toContain(`--astryx-input-${status}: var(--astryx-color-border-${status});`)
      expect(neutral('input')).toContain(`--astryx-input-${status}-foreground: var(--astryx-color-on-${status}-muted);`)
    }
  })

  it('fill status dots with the strong fills and put the on-roles on them', () => {
    for (const status of FIELD_STATUSES)
      expect(neutral('status-dot')).toContain(`--astryx-status-dot-${status}-background: var(--astryx-color-${status});`)
    for (const status of ['info', 'success', 'warning', 'error'])
      expect(core('status-dot')).toContain(`var(--astryx-color-on-${status},`)
    expect(core('avatar')).toContain('var(--astryx-avatar-status-dot-success-foreground, var(--astryx-color-on-success')
    expect(core('avatar')).toContain('var(--astryx-avatar-status-dot-error-foreground, var(--astryx-color-on-error')
  })

  it('write status text on the page with the text roles', () => {
    expect(neutral('dropdown-menu')).toContain('--astryx-dropdown-menu-destructive-foreground: var(--astryx-color-text-error);')
    expect(neutral('more-menu')).toContain('--astryx-more-menu-destructive-foreground: var(--astryx-color-text-error);')
    expect(core('text-area')).toContain('color: var(--astryx-color-text-error')
    expect(core('chat')).toContain('color: var(--astryx-chat-unread-color, var(--astryx-color-text-error));')
    expect(read('packages/richtext/styles/richtext-editor.css')).toContain('color: var(--astryx-color-text-error')
  })

  it('give the chat composer status bar the pale-fill content', () => {
    expect(core('chat')).toMatch(/__status\[data-type='error'\] \{\s*background-color: var\(--astryx-color-error-muted\);\s*color: var\(--astryx-color-on-error-muted\);/)
    expect(core('chat')).toMatch(/__status\[data-type='warning'\] \{\s*background-color: var\(--astryx-color-warning-muted\);\s*color: var\(--astryx-color-on-warning-muted\);/)
  })

  it('keep status fills visible in forced colors', () => {
    for (const name of ['badge', 'status-dot', 'progress-bar', 'stepper', 'list', 'chat', 'banner', 'field', 'button']) {
      const css = core(name)
      const forced = css.slice(css.indexOf('@media (forced-colors: active)'))
      expect(forced, name).toMatch(/(outline|border): 1px solid (CanvasText|ButtonText)/)
    }
  })
})
