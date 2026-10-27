import type { CommandArgs } from '../cli/context.ts'
import { printJson } from '../cli/context.ts'
import { cliVersion } from '../cli/help.ts'
import { successEnvelope } from '../envelope.ts'
import { CliError } from '../error.ts'
import { buildManifest } from '../manifest.ts'
import { BINARY, PACKAGE_NAME } from '../spec.ts'

/** `astryx-vue manifest`: the whole command surface, for an agent to read in one call. */
export function manifestCommand(args: CommandArgs): string {
  if (args.positionals.length > 0)
    throw new CliError('manifest does not take a positional argument.', 'ERR_INVALID_ARGUMENT', 2)
  const manifest = buildManifest(cliVersion())
  if (args.json)
    return printJson(successEnvelope('manifest', manifest, PACKAGE_NAME))
  const lines = [
    `${BINARY} ${manifest.version}`,
    manifest.description,
    '',
    ...manifest.commands.map(command => `${command.name.padEnd(12)} ${command.description}`),
    '',
    `Run \`${BINARY} manifest --json\` for the machine-readable manifest.`,
    '',
  ]
  return lines.join('\n')
}
