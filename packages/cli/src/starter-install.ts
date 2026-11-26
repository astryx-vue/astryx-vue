import type { Project } from './project.ts'
import { installCommands, isExactPin, versionOf } from './project.ts'
import { CORE_PACKAGE } from './spec.ts'

export const THEMES_PACKAGE = '@astryx-vue/themes'

/**
 * The install commands for starter packages the project does not list yet, in
 * the project's own package manager. Core and themes release together, so a
 * themes package added to a project that already lists Core is named at that
 * Core's release; when the project pins Core exactly, the new package is saved
 * exactly too, so the pair never drifts apart.
 */
export function starterInstallCommands(project: Project, names: readonly string[]): string[] {
  const coreRange = project.dependencies[CORE_PACKAGE]
  const coreVersion = versionOf(coreRange)
  const specifiers = names.map(name => name !== CORE_PACKAGE && coreVersion !== null ? `${name}@${coreVersion}` : name)
  return installCommands(project.packageManager, specifiers, { exact: coreVersion !== null && isExactPin(coreRange) })
}

/** The starter packages from `names` that package.json does not list. */
export function missingStarterPackages(project: Project, names: readonly string[]): string[] {
  return names.filter(name => project.dependencies[name] === undefined)
}
