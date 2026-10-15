import type { DocsLocale } from '../docs-i18n'
import accessibilityEn from './accessibility.en.json'
import accessibilityZh from './accessibility.zh.json'
import anatomyEn from './anatomy.en.json'
import anatomyZh from './anatomy.zh.json'

export interface AnatomyPart {
  name: string
  description: string
}

export interface AccessibilityRequirement {
  name: string
  category: string
  criterion: string
  requirement: string
  states: string[]
  description: string
}

interface TranslatedPart {
  name: string
  description: string
}

const anatomyEnglish = anatomyEn as Record<string, AnatomyPart[]>
const anatomyChinese = anatomyZh as Record<string, TranslatedPart[]>
const accessibilityEnglish = accessibilityEn as Record<string, AccessibilityRequirement[]>
const accessibilityChinese = accessibilityZh as Record<string, TranslatedPart[]>

export function hasAnatomy(slug: string): boolean {
  return (anatomyEnglish[slug]?.length ?? 0) > 0
}

export function hasAccessibility(slug: string): boolean {
  return (accessibilityEnglish[slug]?.length ?? 0) > 0
}

export function anatomyFor(slug: string, locale: DocsLocale): AnatomyPart[] | null {
  const parts = anatomyEnglish[slug]
  if (parts == null || parts.length === 0)
    return null
  if (locale === 'en')
    return parts
  const translated = anatomyChinese[slug]
  if (translated == null || translated.length !== parts.length)
    return null
  return translated
}

export function accessibilityFor(slug: string, locale: DocsLocale): AccessibilityRequirement[] | null {
  const items = accessibilityEnglish[slug]
  if (items == null || items.length === 0)
    return null
  if (locale === 'en')
    return items
  const translated = accessibilityChinese[slug]
  if (translated == null || translated.length !== items.length)
    return null
  return items.map((item, index) => ({
    ...item,
    name: translated[index]!.name,
    description: translated[index]!.description,
  }))
}

export const ACCESSIBILITY_REQUIREMENTS = [
  '4.5:1',
  '3:1',
  '3:1 if needed',
  'Not required',
  '3:1 if relied upon',
] as const
