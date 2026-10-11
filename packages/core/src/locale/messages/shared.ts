export function clearLabel(label: string | undefined, fallback: string, prefix: string): string {
  return label != null && label !== '' ? `${prefix}${label}` : fallback
}
