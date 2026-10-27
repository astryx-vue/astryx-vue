export const API_VERSION = 1

export const BINARY = 'astryx-vue'

export const PACKAGE_NAME = '@astryx-vue/cli'

/** The design system package: where every component a project starts with comes from. */
export const CORE_PACKAGE = '@astryx-vue/core'

/** The docs site: where every guide and theme page the CLI prints comes from. */
export const DOCS_PACKAGE = '@astryx-vue/docs'

/** Values `search --type` accepts. Each one names a search domain. */
export const SEARCH_TYPES = ['component', 'composable', 'doc', 'template'] as const

export type SearchType = typeof SEARCH_TYPES[number]

export interface OptionSpec {
  name: string
  flag: string
  type: 'boolean' | 'string'
  description: string
  choices?: readonly string[]
  default?: string
  /** Short forms, such as `-f` for `--overwrite`. */
  aliases?: readonly string[]
}

export interface ErrorSpec {
  code: string
  when: string
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
  /** Error codes this command can put in the JSON envelope. */
  errors?: readonly ErrorSpec[]
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
    description: 'Simplified Chinese wherever the docs and the message have a translation.',
  },
  {
    name: 'cwd',
    flag: '--cwd',
    type: 'string',
    description: 'Project directory. Defaults to the process working directory; template and init write inside it.',
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
    options: [
      { name: 'depth', flag: '--depth', type: 'string', description: 'Print headings down to this level. 2 keeps `#` and `##` and drops deeper subsections with their body. Default: every level.' },
    ],
    json: true,
    responseTypes: ['docs.list', 'docs.detail'],
    examples: [
      `${BINARY} docs`,
      `${BINARY} docs guide/dark-mode`,
      `${BINARY} docs themes/tokens --json`,
      `${BINARY} docs guide/styling --depth 2`,
      `${BINARY} docs dark-mode --zh --dense`,
    ],
    exitCodes: USAGE_EXIT,
    errors: [{ code: 'ERR_INVALID_ARGUMENT', when: '--depth is not a positive whole number, or is passed without a topic.' }],
  },
  {
    name: 'search',
    summary: 'Search components, composables, and docs topics.',
    arguments: [
      { name: 'query', required: true, variadic: true, description: 'Words to search for.' },
    ],
    options: [
      { name: 'limit', flag: '--limit', type: 'string', description: 'Maximum number of results.', default: '20' },
      { name: 'type', flag: '--type', type: 'string', description: 'Restrict the domain: component, composable, doc, or template.', choices: SEARCH_TYPES },
    ],
    json: true,
    responseTypes: ['search'],
    examples: [
      `${BINARY} search button`,
      `${BINARY} search installation --type doc --json`,
      `${BINARY} search login --type template`,
    ],
    exitCodes: USAGE_EXIT,
    errors: [{ code: 'ERR_MISSING_ARGUMENT', when: 'The query is empty.' }],
  },
  {
    name: 'template',
    summary: 'List playground page templates, print one, or copy one into the project.',
    arguments: [
      { name: 'name', required: false, variadic: false, description: 'Template slug, such as login-card. Omit with --list, or to list every template.' },
      { name: 'path', required: false, variadic: false, description: 'File or directory to write into. A directory receives <Name>.vue.' },
    ],
    options: [
      { name: 'list', flag: '--list', type: 'boolean', description: 'List every template with its category and status.' },
      { name: 'skeleton', flag: '--skeleton', type: 'boolean', description: 'Print the layout skeleton only: component tags and layout attributes, no text or handlers.' },
      { name: 'type', flag: '--type', type: 'string', description: 'Restrict to page or block templates. Every template is a page today.', choices: ['page', 'block'] },
      { name: 'overwrite', flag: '--overwrite', type: 'boolean', aliases: ['-f'], description: 'Replace the target file when it already exists.' },
    ],
    json: true,
    responseTypes: ['template.list', 'template.show', 'template.skeleton', 'template.copy'],
    examples: [
      `${BINARY} template --list`,
      `${BINARY} template login-card`,
      `${BINARY} template login-card --skeleton`,
      `${BINARY} template login-card ./src/pages`,
      `${BINARY} template login-card ./src/pages/Login.vue --overwrite`,
      `${BINARY} template --list --type block`,
    ],
    exitCodes: USAGE_EXIT,
    errors: [
      { code: 'ERR_INVALID_ARGUMENT', when: 'Two modes are combined, such as --list with --skeleton, or --type is not page or block.' },
      { code: 'ERR_UNKNOWN_TEMPLATE', when: 'No template matches the slug. The message carries up to five close slugs.' },
      { code: 'ERR_AMBIGUOUS_TEMPLATE', when: 'The slug matches more than one template.' },
      { code: 'ERR_TEMPLATE_NOT_READY', when: 'The template imports a package the project cannot install, so it is shown but not copied.' },
      { code: 'ERR_FILE_EXISTS', when: 'The target file exists and --overwrite was not passed.' },
      { code: 'ERR_PATH_TRAVERSAL', when: 'The target path resolves outside the project directory.' },
      { code: 'ERR_WRITE_FAILED', when: 'The file could not be written.' },
    ],
  },
  {
    name: 'build',
    summary: 'Turn one sentence into the closest page template and the components to use.',
    arguments: [
      { name: 'idea', required: false, variadic: true, description: 'What you are building, in English or Chinese. Omit to print the workflow.' },
    ],
    options: [],
    json: true,
    responseTypes: ['build.help', 'build.kit'],
    examples: [
      `${BINARY} build "login page with SSO"`,
      `${BINARY} build "管理员仪表盘"`,
      `${BINARY} build "admin dashboard with charts" --json`,
      `${BINARY} build --zh "结账流程"`,
    ],
    exitCodes: USAGE_EXIT,
    errors: [{ code: 'ERR_INVALID_ARGUMENT', when: 'The idea is empty or only whitespace.' }],
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
    name: 'theme',
    summary: 'List the built-in themes, or print how to load one.',
    arguments: [
      { name: 'name', required: false, variadic: false, description: 'Theme slug or display name, such as butter or Neutral. Omit to list every theme.' },
    ],
    options: [],
    json: true,
    responseTypes: ['theme.list', 'theme.detail'],
    examples: [
      `${BINARY} theme`,
      `${BINARY} theme butter`,
      `${BINARY} theme neutral --json`,
      `${BINARY} theme butter --zh`,
    ],
    exitCodes: USAGE_EXIT,
    errors: [{ code: 'ERR_UNKNOWN_THEME', when: 'No theme has that slug or display name. Close names come back as suggestions.' }],
  },
  {
    name: 'init',
    summary: 'Write or refresh the managed agent-context block.',
    arguments: [],
    options: [
      { name: 'features', flag: '--features', type: 'string', description: 'Comma-separated features. MVP accepts agents.' },
      { name: 'agent', flag: '--agent', type: 'string', description: 'Which file to write. cursor and codex use AGENTS.md, claude uses CLAUDE.md, hermes uses .hermes.md (or an existing HERMES.md), all writes every agent file the project already has. Without it, an existing agent file is reused.', choices: ['cursor', 'claude', 'codex', 'hermes', 'all'] },
      { name: 'agent-docs-path', flag: '--agent-docs-path', type: 'string', description: 'Write the managed block to this file instead. Relative paths resolve against the project directory.' },
    ],
    json: true,
    responseTypes: ['init.run'],
    examples: [
      `${BINARY} init --features agents`,
      `${BINARY} init --features agents --agent claude`,
      `${BINARY} init --features agents --agent hermes`,
      `${BINARY} init --features agents --agent all`,
      `${BINARY} init --features agents --agent-docs-path docs/AGENTS.md`,
    ],
    exitCodes: USAGE_EXIT,
    errors: [
      { code: 'ERR_UNKNOWN_AGENT', when: '--agent is not one of cursor, claude, codex, hermes, or all.' },
      { code: 'ERR_UNKNOWN_FEATURE', when: '--features names something other than agents.' },
      { code: 'ERR_PATH_TRAVERSAL', when: '--agent-docs-path resolves outside the project directory.' },
      { code: 'ERR_WRITE_FAILED', when: 'The file could not be read or written.' },
    ],
  },
]

export const JSON_SUPPORTED = ['component', 'composable', 'docs', 'search', 'template', 'build', 'manifest', 'theme', 'init', 'help', 'version'] as const

export function commandByName(name: string): CommandSpec | undefined {
  return COMMANDS.find(command => command.name === name)
}
