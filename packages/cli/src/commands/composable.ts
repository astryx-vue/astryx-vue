import type { CommandArgs } from '../cli/context.ts'
import { recordCommand } from './record.ts'

/** `astryx-vue composable [<name>] [--list]`: the `use*` functions and their parameters. */
export function composableCommand(args: CommandArgs): string {
  return recordCommand(args, 'composable')
}
