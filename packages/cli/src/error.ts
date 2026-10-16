export interface Suggestion {
  name: string
  reason: string
}

export class CliError extends Error {
  readonly code: string
  readonly exitCode: number
  readonly suggestions: Suggestion[]

  constructor(message: string, code: string, exitCode = 1, suggestions: Suggestion[] = []) {
    super(message)
    this.name = 'CliError'
    this.code = code
    this.exitCode = exitCode
    this.suggestions = suggestions
  }
}
