import type { CliIO, CliResult, CommandArgs, CommandResult } from './cli/context.ts'
import { localeOf } from './catalog.ts'
import { parseArgv, projectDirectory, validateOptions, workingDirectory } from './cli/args.ts'
import { commandArgs, ok, printJson, wantsJson } from './cli/context.ts'
import { helpEnvelope, printHelp, printVersion } from './cli/help.ts'
import { buildCommand } from './commands/build.ts'
import { componentCommand } from './commands/component.ts'
import { composableCommand } from './commands/composable.ts'
import { docsCommand } from './commands/docs.ts'
import { doctorCommand } from './commands/doctor.ts'
import { initCommand } from './commands/init.ts'
import { manifestCommand } from './commands/manifest.ts'
import { searchCommand } from './commands/search.ts'
import { templateCommand } from './commands/template.ts'
import { themeCommand } from './commands/theme.ts'
import { upgradeCommand } from './commands/upgrade.ts'
import { errorEnvelope } from './envelope.ts'
import { CliError } from './error.ts'
import { commandByName, COMMANDS } from './spec.ts'

export type { CliIO, CliResult } from './cli/context.ts'
export { cliVersion } from './cli/help.ts'

/** One handler per command in `COMMANDS`; `runCli` dispatches on the command name. */
const HANDLERS: Record<string, (args: CommandArgs) => CommandResult | Promise<CommandResult>> = {
  build: buildCommand,
  component: componentCommand,
  composable: composableCommand,
  docs: docsCommand,
  doctor: doctorCommand,
  init: initCommand,
  manifest: manifestCommand,
  search: searchCommand,
  template: templateCommand,
  theme: themeCommand,
  upgrade: upgradeCommand,
}

export async function runCli(argv: readonly string[], io: CliIO = {}): Promise<CliResult> {
  try {
    const parsed = parseArgv(argv)
    validateOptions(parsed)
    const cwd = projectDirectory(parsed, workingDirectory(io.cwd))
    if (parsed.options.version === true && parsed.options.help !== true)
      return ok(printVersion(parsed.options.json === true))
    if (parsed.options.help === true || (parsed.command === null && parsed.options.json !== true))
      return ok(printHelp(parsed.command, parsed.options.json === true))
    if (parsed.command === null && parsed.options.json === true)
      return ok(printJson(helpEnvelope()))
    const output = await dispatch(parsed.command, commandArgs(parsed, cwd, localeOf))
    return typeof output === 'string' ? ok(output) : { exitCode: output.exitCode, stdout: output.stdout, stderr: '' }
  }
  catch (error) {
    const cliError = error instanceof CliError
      ? error
      : new CliError(error instanceof Error ? error.message : 'Unknown error', 'ERR_UNKNOWN', 1)
    const json = wantsJson(argv)
    return {
      exitCode: cliError.exitCode,
      stdout: json ? printJson(errorEnvelope(cliError)) : '',
      stderr: json ? '' : `${cliError.message}\n`,
    }
  }
}

async function dispatch(name: string | null, args: CommandArgs): Promise<CommandResult> {
  const handler = name === null ? undefined : HANDLERS[name]
  if (name === null || handler === undefined || commandByName(name) === undefined) {
    const suggestion = COMMANDS.find(command => command.name.startsWith(name ?? ''))
    throw new CliError(
      `Unknown command "${name}".`,
      'ERR_UNKNOWN_COMMAND',
      2,
      suggestion ? [{ name: suggestion.name, reason: 'similar name' }] : COMMANDS.map(command => ({ name: command.name, reason: 'similar name' })),
    )
  }
  return handler(args)
}
