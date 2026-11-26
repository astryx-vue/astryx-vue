import process from 'node:process'
import { CliError } from '../error.ts'
import { BINARY, commandByName, COMMANDS, GLOBAL_OPTIONS } from '../spec.ts'

/** One argv line, split into the command name, its positionals, and its options. */
export interface ParsedArgs {
  command: string | null
  positionals: string[]
  options: Record<string, string | boolean>
}

/**
 * Flags are read before the command decides what they mean: `--type` filters
 * search domains and template kinds, so the arity lives here and the accepted
 * values are checked once the command is known.
 */
const FLAG_SPECS = new Map<string, { type: 'boolean' | 'string', name: string }>()
for (const option of [...GLOBAL_OPTIONS, ...COMMANDS.flatMap(command => command.options)]) {
  for (const flag of [option.flag, ...(option.aliases ?? [])])
    FLAG_SPECS.set(flag, { type: option.type, name: option.name })
}

/**
 * Options that answer a prompt in other tools. No command here asks one, so the
 * run without the option is the run as meant.
 */
const CONFIRM_OPTIONS = new Set([
  '--yes',
  '-y',
  '--assume-yes',
  '--non-interactive',
  '--no-interactive',
  '--no-input',
])

export function parseArgv(argv: readonly string[]): ParsedArgs {
  const positionals: string[] = []
  const options: Record<string, string | boolean> = {}
  let command: string | null = null
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index] ?? ''
    if (arg === '--') {
      positionals.push(...argv.slice(index + 1))
      break
    }
    if (!isOptionToken(arg)) {
      if (command === null)
        command = arg
      else
        positionals.push(arg)
      continue
    }
    const [flag, inline] = arg.split('=', 2) as [string, string?]
    const spec = FLAG_SPECS.get(flag)
    if (!spec && CONFIRM_OPTIONS.has(flag))
      throw confirmOptionError(flag, argv)
    if (!spec)
      throw new CliError(`Unknown option ${flag}.`, 'ERR_INVALID_OPTION', 2)
    if (spec.type === 'boolean') {
      if (inline !== undefined)
        throw new CliError(`${flag} does not take a value.`, 'ERR_INVALID_ARGUMENT', 2)
      options[spec.name] = true
      continue
    }
    const value = inline ?? argv[index + 1]
    if (value === undefined || (inline === undefined && value.startsWith('--')))
      throw new CliError(`${flag} needs a value.`, 'ERR_MISSING_ARGUMENT', 2)
    if (inline === undefined)
      index++
    options[spec.name] = value
  }
  return { command, positionals, options }
}

/**
 * Checks each parsed option against the resolved command: an option another
 * command declares is a mistake here, and a value outside the declared choices
 * is reported with its own code.
 */
export function validateOptions(parsed: ParsedArgs): void {
  const command = commandByName(parsed.command ?? '')
  const specs = [...GLOBAL_OPTIONS, ...(command?.options ?? [])]
  for (const [name, value] of Object.entries(parsed.options)) {
    const spec = specs.find(option => option.name === name)
    if (!spec)
      throw new CliError(`Unknown option --${name}.`, 'ERR_INVALID_OPTION', 2)
    if (spec.choices && typeof value === 'string' && !spec.choices.includes(value)) {
      const code = spec.name === 'agent' ? 'ERR_UNKNOWN_AGENT' : 'ERR_INVALID_ARGUMENT'
      throw new CliError(`--${name} must be one of ${spec.choices.join(', ')}.`, code, 2)
    }
  }
}

/**
 * A confirm-style option names the run without it. Another mistake in that run
 * is the one reported, since dropping the option alone would not fix it.
 */
function confirmOptionError(flag: string, argv: readonly string[]): CliError {
  const end = argv.indexOf('--')
  const run = argv.filter((arg, index) => (end !== -1 && index > end) || arg.split('=', 2)[0] !== flag)
  validateOptions(parseArgv(run))
  const line = [BINARY, ...run.map(quoteArgument)].join(' ')
  return new CliError(
    `${flag} is not needed: ${BINARY} commands never ask questions. Drop it and run: ${line}`,
    'ERR_INVALID_OPTION',
    2,
    [{ name: line, reason: 'do this instead' }],
  )
}

function quoteArgument(arg: string): string {
  return /^[\w@%+=:,./-]+$/.test(arg) ? arg : `'${arg.replace(/'/g, `'\\''`)}'`
}

/** Long flags, plus the short aliases declared in the command spec and `-y`. */
function isOptionToken(arg: string): boolean {
  if (arg.startsWith('--'))
    return true
  const flag = arg.split('=', 2)[0] ?? ''
  return arg.startsWith('-') && arg.length > 1 && (FLAG_SPECS.has(flag) || CONFIRM_OPTIONS.has(flag))
}

/** The project directory the command runs in: `--cwd` wins over the caller's default. */
export function projectDirectory(parsed: ParsedArgs, fallback: string): string {
  return typeof parsed.options.cwd === 'string' ? parsed.options.cwd : fallback
}

export function workingDirectory(ioCwd: string | undefined): string {
  return ioCwd ?? process.cwd()
}
