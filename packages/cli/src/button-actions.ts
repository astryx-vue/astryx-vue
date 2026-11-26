import type { SourceFile } from './project.ts'
import type { TemplateElement } from './vue-template.ts'
import { attrKind, coreImports, isTestPath, isTrustedElement, scriptsOf, trustedAround } from './button-context.ts'
import { createReach } from './button-reach.ts'
import { isElement, parseTemplate, templateBlock } from './vue-template.ts'

export interface ButtonFinding {
  file: string
  line: number
  component: 'Button' | 'IconButton'
  /** The static `label`, or the text the button holds; null when neither is written. */
  label: string | null
  /** Why a written action does nothing, such as an empty handler; null for no action at all. */
  note: string | null
}

export interface ButtonScan {
  found: ButtonFinding[]
  /** How many source files were read. */
  files: number
  /** Where the app listens for a press through the DOM, as `file:line`, when it does: then no button is judged. */
  domListener?: string
}

const BUTTONS = new Set(['Button', 'IconButton'])

/**
 * Props of a Core button that change how it looks or reads, never what a press
 * does. `type`, the disabled and loading states and the action props are read
 * on their own.
 */
const LOOK_PROPS = new Set([
  'class',
  'dir',
  'elevation',
  'icon',
  'isIconOnly',
  'isInterruptible',
  'key',
  'label',
  'lang',
  'loadingLabel',
  'name',
  'rel',
  'size',
  'style',
  'tabindex',
  'target',
  'title',
  'value',
  'variant',
  'width',
])

/**
 * A handler that does nothing: an empty body, or one that only returns nothing.
 * Read with every space removed, so `() => {}` and `()=>{ }` are one form.
 */
const EMPTY_HANDLER_FORMS = [
  /^(?:async)?(?:\([^)]*\)|[\w$]+)=>(?:\{\}|\{return(?:null|undefined|void0)?;?\}|null|undefined|void0|\(\))$/,
  /^(?:async)?function[\w$]*\([^)]*\)\{\}$/,
  /^(?:null|undefined|void0)?$/,
]

function isEmptyHandler(value: string | null): boolean {
  const compact = (value ?? '').replace(/\s+/g, '')
  return EMPTY_HANDLER_FORMS.some(form => form.test(compact))
}

/**
 * Finds the Core `Button` and `IconButton` elements in the app's own components
 * that do nothing when pressed: no click handler, `clickAction`, `href`, or
 * `submit`/`reset` type, or one that is empty or goes nowhere, with nothing
 * around them that acts on a press. It reads templates and never runs them, and
 * reports only what it can judge: a button it cannot read fully is left out.
 */
export function findButtonsWithoutAction(files: readonly SourceFile[]): ButtonScan {
  const reach = createReach(files)
  if (reach.domListener)
    return { found: [], files: files.length, domListener: reach.domListener }

  const found: ButtonFinding[] = []
  for (const file of files) {
    if (!file.path.endsWith('.vue') || isTestPath(file.path) || reach.isUnreachable(file.path))
      continue
    const imports = coreImports(scriptsOf(file))
    if (![...imports.values()].some(name => BUTTONS.has(name)))
      continue
    const block = templateBlock(file.text)
    if (!block)
      continue
    const root = parseTemplate(block.content, block.line)
    const candidates: { element: TemplateElement, finding: ButtonFinding }[] = []
    walk(root, (element) => {
      const name = imports.get(element.tag)
      if (!name || !BUTTONS.has(name))
        return
      const verdict = judgeButton(element, imports, reach.hashRouting)
      if (verdict && trustedAround(element.parent, imports))
        candidates.push({ element, finding: { file: file.path, line: element.line, component: name as ButtonFinding['component'], label: labelOf(element), note: verdict.note } })
    })
    if (candidates.length > 0 && reach.nothingAround(file.path))
      found.push(...candidates.map(candidate => candidate.finding))
  }
  return { found: found.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line), files: files.length }
}

/** Null when the button acts, or when it cannot be judged; otherwise why it does nothing. */
function judgeButton(element: TemplateElement, imports: ReadonlyMap<string, string>, hashRouting: boolean): { note: string | null } | null {
  let note: string | null = null
  for (const attr of element.attrs) {
    const kind = attrKind(attr)
    if (kind.type === 'spread' || kind.type === 'directive')
      return null
    if (kind.type === 'render')
      continue
    if (kind.type === 'event') {
      if (kind.name !== 'click' || !isEmptyHandler(attr.value))
        return null
      note = 'empty handler'
      continue
    }
    const { name, bound } = kind
    if (name === 'onClick' || name === 'clickAction') {
      if (!bound || !isEmptyHandler(attr.value))
        return null
      note = 'empty handler'
    }
    else if (name === 'href') {
      const href = (attr.value ?? '').trim()
      if (bound || !(href === '' || (href === '#' && !hashRouting) || /^javascript:/i.test(href)))
        return null
      note = href === '' ? 'empty link' : `link to ${href}`
    }
    else if (name === 'type') {
      if (bound || attr.value === 'submit' || attr.value === 'reset')
        return null
    }
    else if (!LOOK_PROPS.has(name) && !/^(?:aria|data)-/.test(attr.name.replace(/^(?::|v-bind:)/, ''))) {
      return null
    }
  }
  return contentIsPlain(element, imports) ? { note } : null
}

/** True when nothing inside the button may act: text, icons, layout, or plain HTML with no handler. */
function contentIsPlain(element: TemplateElement, imports: ReadonlyMap<string, string>): boolean {
  for (const child of element.children) {
    if (!isElement(child))
      continue
    if (child.tag === 'template') {
      if (child.attrs.some(attr => !/^(?:#|v-slot|v-if|v-else|v-show)/.test(attr.name)) || !contentIsPlain(child, imports))
        return false
      continue
    }
    const core = imports.get(child.tag)
    const isIcon = core === 'Icon' || (!core && /^[A-Z]\w*Icon$/.test(child.tag))
    const isHtml = /^[a-z][a-z0-9]*$/.test(child.tag)
    if (!isIcon && !(isHtml && isTrustedElement(child, imports)))
      return false
    if (!contentIsPlain(child, imports))
      return false
  }
  return true
}

function labelOf(element: TemplateElement): string | null {
  const label = element.attrs.find(attr => attr.name === 'label')?.value
  if (label)
    return label
  const text = element.children.map(child => (isElement(child) ? '' : child.text)).join(' ').replace(/\s+/g, ' ').trim()
  return text || null
}

function walk(element: TemplateElement, visit: (element: TemplateElement) => void): void {
  for (const child of element.children) {
    if (isElement(child)) {
      visit(child)
      walk(child, visit)
    }
  }
}
