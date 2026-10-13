import type { ThemeState } from './theme'
import { sanitizeTheme } from './theme'

export interface SharePayload {
  v: 1
  templateId: string
  code: string
  theme: ThemeState
}

const HASH_PREFIX = 'pg='

export async function encodeShare(payload: SharePayload): Promise<string> {
  const bytes = await compress(JSON.stringify(payload))
  return bytesToBase64Url(bytes)
}

export async function decodeShare(hash: string): Promise<SharePayload | null> {
  const encoded = hash.startsWith('#') ? hash.slice(1) : hash
  if (!encoded.startsWith(HASH_PREFIX))
    return null
  try {
    const json = await decompress(base64UrlToBytes(encoded.slice(HASH_PREFIX.length)))
    return parsePayload(JSON.parse(json))
  }
  catch {
    return null
  }
}

export function shareHash(encoded: string): string {
  return `${HASH_PREFIX}${encoded}`
}

function parsePayload(value: unknown): SharePayload | null {
  if (!value || typeof value !== 'object')
    return null
  const payload = value as Partial<SharePayload>
  if (payload.v !== 1 || typeof payload.code !== 'string' || typeof payload.templateId !== 'string')
    return null
  const theme = sanitizeTheme(payload.theme)
  if (!theme)
    return null
  return {
    v: 1,
    templateId: payload.templateId,
    code: payload.code,
    theme,
  }
}

async function compress(text: string): Promise<Uint8Array> {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

async function decompress(bytes: Uint8Array): Promise<string> {
  const stream = blobFromBytes(bytes).stream().pipeThrough(new DecompressionStream('deflate-raw'))
  return new Response(stream).text()
}

function blobFromBytes(bytes: Uint8Array): Blob {
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)
  return new Blob([buffer])
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes)
    binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - value.length % 4) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1)
    bytes[index] = binary.charCodeAt(index)
  return bytes
}
