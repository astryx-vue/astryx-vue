import type { AnyEnvelope } from '../envelope.ts'
import packageJson from '../../package.json' with { type: 'json' }
import { successEnvelope } from '../envelope.ts'
import { CliError } from '../error.ts'
import { buildManifest } from '../manifest.ts'
import { BINARY, commandByName, COMMANDS, GLOBAL_OPTIONS } from '../spec.ts'
import { printJson } from './context.ts'

export function cliVersion(): string {
  return packageJson.version
}

export function printVersion(json: boolean): string {
  const version = cliVersion()
  if (json)
    return printJson(successEnvelope('version', { version }))
  return `${version}\n`
}

/** `--help` with no command: the root help, or the manifest for `--json`. */
export function printHelp(commandName: string | null, json: boolean): string {
  if (json)
    return printJson(commandName ? commandHelpEnvelope(commandName) : helpEnvelope())
  if (!commandName)
    return rootHelp()
  const command = commandByName(commandName)
  if (!command)
    throw new CliError(`Unknown command "${commandName}".`, 'ERR_UNKNOWN_COMMAND', 2)
  const usage = [`${BINARY} ${command.name}`, ...command.arguments.map(argument => argument.required ? `<${argument.name}>` : `[${argument.name}]`)].join(' ')
  const optionLines = [...GLOBAL_OPTIONS, ...command.options].map((option) => {
    const flags = [option.flag, ...(option.aliases ?? [])].join(', ')
    return `  ${flags.padEnd(18)} ${option.description}`
  })
  return [`${usage}`, '', command.summary, '', 'Options:', ...optionLines, '', 'Examples:', ...command.examples.map(example => `  ${example}`), ''].join('\n')
}

export function helpEnvelope(): AnyEnvelope {
  const manifest = buildManifest(cliVersion())
  return successEnvelope('help', {
    name: BINARY,
    version: manifest.version,
    commands: COMMANDS.map(command => command.name),
    jsonSupported: manifest.jsonSupported,
    manifest,
  })
}

export function commandHelpEnvelope(commandName: string): AnyEnvelope {
  const command = commandByName(commandName)
  if (!command)
    throw new CliError(`Unknown command "${commandName}".`, 'ERR_UNKNOWN_COMMAND', 2)
  return successEnvelope('help', {
    command: command.name,
    description: command.summary,
    usage: `${BINARY} ${command.name}`,
    options: [...GLOBAL_OPTIONS, ...command.options].map(option => ({
      flag: option.flag,
      description: option.description,
      ...(option.aliases ? { aliases: [...option.aliases] } : {}),
      ...(option.default !== undefined ? { defaultValue: option.default } : {}),
      ...(option.choices ? { choices: [...option.choices] } : {}),
    })),
  })
}

/** The one screen a person sees before knowing what to type. */
function rootHelp(): string {
  return [
    `${BINARY} — agent-friendly CLI for astryx-vue`,
    '',
    'This is @astryx-vue/cli. It is not Meta\'s astryx binary.',
    '',
    'Commands:',
    `  ${BINARY} component --list`,
    `  ${BINARY} component <Name>`,
    `  ${BINARY} composable --list`,
    `  ${BINARY} composable <Name>`,
    `  ${BINARY} docs [topic] [--depth <n>]`,
    `  ${BINARY} search <query> [--type template]`,
    `  ${BINARY} template --list`,
    `  ${BINARY} template <slug> [path]`,
    `  ${BINARY} build "<idea>"`,
    `  ${BINARY} manifest --json`,
    `  ${BINARY} init [--features agents]`,
    `  ${BINARY} theme [name]`,
    `  ${BINARY} upgrade`,
    `  ${BINARY} doctor`,
    '',
    'Global flags: --json  --dense  --zh  --cwd <dir>  --help  --version',
    '',
    `Run \`${BINARY} manifest --json\` for commands, options, response types, and exit codes.`,
    '',
  ].join('\n')
}
