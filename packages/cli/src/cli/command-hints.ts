import type { Suggestion } from '../error.ts'
import { BINARY, COMMANDS } from '../spec.ts'

/** Words from other command lines that name a command here, and the words that follow them. */
interface Alias {
  /** The command and options that do the job, without the rest of the typed words. */
  run: string
  /** Whether the typed words after the alias still belong to the run. */
  keepsRest: boolean
}

const ALIASES: Record<string, Alias> = {
  components: { run: 'component --list', keepsRest: false },
  composables: { run: 'composable --list', keepsRest: false },
  templates: { run: 'template --list', keepsRest: false },
  topics: { run: 'docs --list', keepsRest: false },
  guides: { run: 'docs --list', keepsRest: false },
  list: { run: 'component --list', keepsRest: false },
  ls: { run: 'component --list', keepsRest: false },
  hook: { run: 'composable', keepsRest: true },
  hooks: { run: 'composable --list', keepsRest: false },
  props: { run: 'component', keepsRest: true },
  info: { run: 'component', keepsRest: true },
  show: { run: 'component', keepsRest: true },
  doc: { run: 'docs', keepsRest: true },
  guide: { run: 'docs', keepsRest: true },
  find: { run: 'search', keepsRest: true },
  query: { run: 'search', keepsRest: true },
  lookup: { run: 'search', keepsRest: true },
  migrate: { run: 'upgrade', keepsRest: true },
  update: { run: 'upgrade', keepsRest: true },
  check: { run: 'doctor', keepsRest: true },
  lint: { run: 'doctor', keepsRest: true },
  validate: { run: 'doctor', keepsRest: true },
  setup: { run: 'init', keepsRest: true },
}

/** The commands a typed word that is no command points to: the other tool's word for it, or a command it starts. */
export function unknownCommandHints(name: string, rest: readonly string[]): Suggestion[] {
  const alias = ALIASES[name.toLowerCase()]
  if (alias) {
    const run = [BINARY, alias.run, ...(alias.keepsRest ? rest : [])].join(' ')
    return [{ name: run, reason: 'do this instead' }]
  }
  const starts = COMMANDS.filter(command => command.name.startsWith(name))
  return (starts.length > 0 ? starts : COMMANDS).map(command => ({ name: command.name, reason: 'similar name' }))
}
