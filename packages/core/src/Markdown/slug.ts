/** URL slug for a heading. Letters and numbers from any language are kept. */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * `setup`, then `setup-1`, then `setup-2`. An empty slug becomes `section`.
 * One map covers a whole document.
 */
export function uniqueSlug(baseSlug: string, counts: Map<string, number>): string {
  const slug = baseSlug === '' ? 'section' : baseSlug
  const seen = counts.get(slug) ?? 0
  counts.set(slug, seen + 1)
  return seen === 0 ? slug : `${slug}-${seen}`
}
