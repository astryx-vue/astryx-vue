export const API_VERSION = 1

export const BINARY = 'astryx-vue'

export const PACKAGE_NAME = '@astryx-vue/cli'

/** Values `search --type` accepts. Each one names a search domain. */
export const SEARCH_TYPES = ['component', 'composable', 'doc'] as const

export type SearchType = typeof SEARCH_TYPES[number]

export interface OptionSpec {
  name: string
  flag: string
  type: 'boolean' | 'string'
  description: string
  choices?: readonly string[]
  default?: string
}

export interface ArgumentSpec {
  name: string
  required: boolean
  variadic: boolean
  description: string
}

export interface ExitSpec {
  code: number
  when: string
}

export interface CommandSpec {
  name: string
  summary: string
  arguments: readonly ArgumentSpec[]
  options: readonly OptionSpec[]
  json: boolean
  responseTypes: readonly string[]
  examples: readonly string[]
  exitCodes: readonly ExitSpec[]
}

export const GLOBAL_OPTIONS: readonly OptionSpec[] = [
  {
    name: 'json',
    flag: '--json',
    type: 'boolean',
    description: 'Print a typed JSON envelope on stdout. Errors use the same envelope and a non-zero exit code.',
  },
  {
    name: 'dense',
    flag: '--dense',
    type: 'boolean',
    description: 'Shorter text for humans. Ignored together with --json, which always returns the full envelope.',
  },
  {
    name: 'zh',
    flag: '--zh',
    type: 'boolean',
    description: 'Simplified Chinese for component docs, search snippets, and the agent block, when the docs have a translation.',
  },
  {
    name: 'cwd',
    flag: '--cwd',
    type: 'string',
    description: 'Directory init writes into. Defaults to the process working directory.',
  },
  {
    name: 'help',
    flag: '--help',
    type: 'boolean',
    description: 'Show help for the command.',
  },
  {
    name: 'version',
    flag: '--version',
    type: 'boolean',
    description: 'Print the CLI version.',
  },
]

const USAGE_EXIT: readonly ExitSpec[] = [
  { code: 0, when: 'Success.' },
  { code: 1, when: 'The command ran but could not finish, such as an unknown component or a failed write.' },
  { code: 2, when: 'Invalid usage: unknown command, unknown option, or a bad argument.' },
]

export const COMMANDS: readonly CommandSpec[] = [
  {
    name: 'component',
    summary: 'List components or print one component\'s docs.',
    arguments: [
      { name: 'name', required: false, variadic: false, description: 'Component name, such as Button or button-group. Omit with --list.' },
    ],
    options: [
      { name: 'list', flag: '--list', type: 'boolean', description: 'List every documented component.' },
    ],
    json: true,
    responseTypes: ['component.list', 'component.detail'],
    examples: [
      `${BINARY} component --list`,
      `${BINARY} component Button`,
      `${BINARY} component Button --json`,
      `${BINARY} component Button --zh --dense`,
    ],
    exitCodes: USAGE_EXIT,
  },
  {
    name: 'composable',
    summary: 'List composables or print one composable\'s parameters and returns.',
    arguments: [
      { name: 'name', required: false, variadic: false, description: 'Composable name, such as useClipboard or use-clipboard. Omit with --list.' },
    ],
    options: [
      { name: 'list', flag: '--list', type: 'boolean', description: 'List every documented composable.' },
    ],
    json: true,
    responseTypes: ['composable.list', 'composable.detail'],
    examples: [
      `${BINARY} composable --list`,
      `${BINARY} composable useClipboard`,
      `${BINARY} composable useClipboard --json`,
      `${BINARY} composable use-clipboard --zh --dense`,
    ],
    exitCodes: USAGE_EXIT,
  },
  {
    name: 'docs',
    summary: 'List guide and theme topics, or print one topic\'s page.',
    arguments: [
      { name: 'topic', required: false, variadic: false, description: 'Topic id such as guide/dark-mode or themes/tokens, or a unique bare name such as dark-mode. Omit to list every topic.' },
    ],
    options: [],
    json: true,
    responseTypes: ['docs.list', 'docs.detail'],
    examples: [
      `${BINARY} docs`,
      `${BINARY} docs guide/dark-mode`,
      `${BINARY} docs themes/tokens --json`,
      `${BINARY} docs dark-mode --zh --dense`,
    ],
    exitCodes: USAGE_EXIT,
  },
  {
    name: 'search',
    summary: 'Search components, composables, and docs topics.',
    arguments: [
      { name: 'query', required: true, variadic: true, description: 'Words to search for.' },
    ],
    options: [
      { name: 'limit', flag: '--limit', type: 'string', description: 'Maximum number of results.', default: '20' },
      { name: 'type', flag: '--type', type: 'string', description: 'Restrict the domain.', choices: SEARCH_TYPES },
    ],
    json: true,
    responseTypes: ['search'],
    examples: [
      `${BINARY} search button`,
      `${BINARY} search installation --type doc --json`,
    ],
    exitCodes: USAGE_EXIT,
  },
  {
    name: 'manifest',
    summary: 'Print the capability manifest agents use to discover this CLI.',
    arguments: [],
    options: [],
    json: true,
    responseTypes: ['manifest'],
    examples: [`${BINARY} manifest --json`],
    exitCodes: USAGE_EXIT,
  },
  {
    name: 'init',
    summary: 'Write or refresh the managed agent-context block.',
    arguments: [],
    options: [
      { name: 'features', flag: '--features', type: 'string', description: 'Comma-separated features. MVP accepts agents.' },
      { name: 'agent', flag: '--agent', type: 'string', description: 'Which file to write. cursor and codex use AGENTS.md. claude uses CLAUDE.md. The default file is AGENTS.md.', choices: ['cursor', 'claude', 'codex'] },
    ],
    json: true,
    responseTypes: ['init.run'],
    examples: [
      `${BINARY} init --features agents`,
      `${BINARY} init --features agents --agent claude`,
    ],
    exitCodes: USAGE_EXIT,
  },
]

export const JSON_SUPPORTED = ['component', 'composable', 'docs', 'search', 'manifest', 'init', 'help', 'version'] as const

export function commandByName(name: string): CommandSpec | undefined {
  return COMMANDS.find(command => command.name === name)
}
