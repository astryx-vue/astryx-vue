import type { AnyEnvelope } from '../envelope.ts'
import type { ParsedArgs } from './args.ts'

export interface CliIO {
  cwd?: string
}

export interface CliResult {
  exitCode: number
  stdout: string
  stderr: string
}

/**
 * What one command needs from the command line, already resolved: the words to
 * look up, the flags it cares about, and the three output switches every
 * command honours (`--json`, `--dense`, `--zh`).
 */
export interface CommandArgs {
  positionals: string[]
  options: Record<string, string | boolean>
  json: boolean
  /** Never true together with `json`: the envelope is always the full payload. */
  dense: boolean
  locale: 'en' | 'zh'
  cwd: string
}

export function commandArgs(parsed: ParsedArgs, cwd: string, localeOf: (zh: boolean) => 'en' | 'zh'): CommandArgs {
  const json = parsed.options.json === true
  return {
    positionals: parsed.positionals,
    options: parsed.options,
    json,
    dense: parsed.options.dense === true && !json,
    locale: localeOf(parsed.options.zh === true),
    cwd,
  }
}

/** Every command answers with text: the JSON envelope is text too. */
export function printJson(value: AnyEnvelope): string {
  return `${JSON.stringify(value)}\n`
}

export function ok(stdout: string): CliResult {
  return { exitCode: 0, stdout, stderr: '' }
}

/** Whether an error should come back as a JSON envelope. Read from argv, since parsing may have failed. */
export function wantsJson(argv: readonly string[]): boolean {
  return argv.includes('--json')
}
