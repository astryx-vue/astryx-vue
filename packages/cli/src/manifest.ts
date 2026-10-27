import type { CatalogPackage } from './catalog-types.ts'
import type { CommandSpec, OptionSpec } from './spec.ts'
import { catalog } from './catalog.ts'
import { API_VERSION, BINARY, COMMANDS, GLOBAL_OPTIONS, JSON_SUPPORTED, PACKAGE_NAME } from './spec.ts'

export interface ManifestOption {
  flag: string
  type: 'boolean' | 'string'
  description: string
  choices?: string[]
  default?: string
  aliases?: string[]
}

export interface ManifestCommand {
  name: string
  description: string
  arguments: { name: string, required: boolean, variadic: boolean, description: string }[]
  options: ManifestOption[]
  json: boolean
  responseTypes: string[]
  examples: string[]
  exitCodes: { code: number, when: string }[]
  /** Error codes the JSON envelope can carry for this command. */
  errors?: { code: string, when: string }[]
}

export interface ManifestData {
  name: string
  package: string
  version: string
  apiVersion: number
  description: string
  globalOptions: ManifestOption[]
  commands: ManifestCommand[]
  jsonSupported: string[]
  responseTypes: Record<string, string[]>
  /** Every package a result can come from, so an agent knows what it can install. */
  packages: CatalogPackage[]
}

export function buildManifest(version: string): ManifestData {
  const commands = COMMANDS.map(toManifestCommand)
  return {
    name: BINARY,
    package: PACKAGE_NAME,
    version,
    apiVersion: API_VERSION,
    description: 'Agent-friendly CLI for astryx-vue. Reads component docs derived from the Vue docs site. Not Meta\'s astryx CLI.',
    globalOptions: GLOBAL_OPTIONS.map(toManifestOption),
    commands,
    jsonSupported: [...JSON_SUPPORTED],
    responseTypes: Object.fromEntries(commands.map(command => [command.name, command.responseTypes])),
    packages: catalog.packages.map(pkg => ({ ...pkg })),
  }
}

function toManifestCommand(command: CommandSpec): ManifestCommand {
  return {
    name: command.name,
    description: command.summary,
    arguments: command.arguments.map(argument => ({ ...argument })),
    options: command.options.map(toManifestOption),
    json: command.json,
    responseTypes: [...command.responseTypes],
    examples: [...command.examples],
    exitCodes: command.exitCodes.map(exit => ({ ...exit })),
    ...(command.errors ? { errors: command.errors.map(error => ({ ...error })) } : {}),
  }
}

function toManifestOption(option: OptionSpec): ManifestOption {
  return {
    flag: option.type === 'string' ? `${option.flag} <${option.name}>` : option.flag,
    type: option.type,
    description: option.description,
    ...(option.choices ? { choices: [...option.choices] } : {}),
    ...(option.default !== undefined ? { default: option.default } : {}),
    ...(option.aliases ? { aliases: [...option.aliases] } : {}),
  }
}
