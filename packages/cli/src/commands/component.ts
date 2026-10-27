import type { CommandArgs } from '../cli/context.ts'
import { recordCommand } from './record.ts'

/** `astryx-vue component [<name>] [--list]`: documented components and their docs pages. */
export function componentCommand(args: CommandArgs): string {
  return recordCommand(args, 'component')
}
