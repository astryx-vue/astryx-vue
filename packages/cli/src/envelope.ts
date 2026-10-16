import type { CliError } from './error.ts'
import { API_VERSION } from './spec.ts'

export interface ErrorEnvelope {
  apiVersion: number
  error: string
  code: string
  suggestions?: { name: string, reason: string }[]
}

export interface SuccessEnvelope<TType extends string = string, TData = unknown> {
  apiVersion: number
  type: TType
  package?: string
  data: TData
}

export type AnyEnvelope = SuccessEnvelope | ErrorEnvelope

export function successEnvelope<TType extends string, TData>(type: TType, data: TData, packageName?: string): SuccessEnvelope<TType, TData> {
  return packageName
    ? { apiVersion: API_VERSION, type, package: packageName, data }
    : { apiVersion: API_VERSION, type, data }
}

export function errorEnvelope(error: CliError): ErrorEnvelope {
  return {
    apiVersion: API_VERSION,
    error: error.message,
    code: error.code,
    ...(error.suggestions.length > 0 ? { suggestions: error.suggestions } : {}),
  }
}

export function isError(value: unknown): value is ErrorEnvelope {
  return typeof value === 'object' && value !== null && 'error' in value && 'code' in value && !('type' in value)
}

export function parseResponse(raw: string): AnyEnvelope {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  }
  catch {
    throw new Error('CLI output is not JSON')
  }
  if (typeof parsed !== 'object' || parsed === null || !('apiVersion' in parsed))
    throw new Error('CLI output is not an envelope')
  return parsed as AnyEnvelope
}

export function assertResponse<TType extends string>(raw: unknown, type: TType): SuccessEnvelope<TType> {
  const value = typeof raw === 'string' ? parseResponse(raw) : raw
  if (isError(value))
    throw new Error(`${value.code}: ${value.error}`)
  if (typeof value !== 'object' || value === null || !('type' in value) || value.type !== type)
    throw new Error(`expected envelope type ${type}`)
  return value as SuccessEnvelope<TType>
}
