const BLOCKED = new Set(['role', 'tabindex', 'contenteditable'])

/**
 * Attributes that may reach a decorative graphic.
 *
 * The graphic announces nothing of its own. Role, tab stop, and aria
 * attributes stay on the control that owns the name, even if a caller
 * forwards them.
 */
export function decorativeAttrs(attrs: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => {
    const normalized = key.toLowerCase()
    return !normalized.startsWith('aria') && !BLOCKED.has(normalized)
  }))
}
