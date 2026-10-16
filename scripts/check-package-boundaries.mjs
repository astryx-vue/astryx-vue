import { readdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const packageFiles = [join(rootDir, 'package.json')]

for (const parent of ['apps', 'packages']) {
  const parentDir = join(rootDir, parent)
  const entries = await readdir(parentDir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory())
      packageFiles.push(join(parentDir, entry.name, 'package.json'))
  }
}

const reactPackagePatterns = [
  /^@eslint-react\//,
  /^@mdx-js\/react$/,
  /^@types\/react(?:-dom)?$/,
  /^@unhead\/react$/,
  /^lucide-react$/,
  /^react(?:$|-)/,
]

const forbiddenToolPattern = /^(?:@(?:rsbuild|rspack|rslib|rstest|rspress|rsdoctor|rspeedy)\/|(?:rsbuild|rspack|rslib|rstest|rspress|rsdoctor|rspeedy)(?:$|-))/

const dependencyFields = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
]

const errors = []

for (const packageFile of packageFiles) {
  const packageJson = JSON.parse(await readFile(packageFile, 'utf8'))
  const relativeFile = packageFile.slice(rootDir.length + 1)
  const isPublicPackage = packageJson.name === '@astryx-vue/core'
    || packageJson.name === '@astryx-vue/themes'
    || packageJson.name === '@astryx-vue/cli'

  if (isPublicPackage && packageJson.private)
    errors.push(`${relativeFile}: public package cannot be private`)

  for (const field of dependencyFields) {
    for (const [name, version] of Object.entries(packageJson[field] ?? {})) {
      if (forbiddenToolPattern.test(name))
        errors.push(`${relativeFile}: ${name} is not allowed`)

      if (reactPackagePatterns.some(pattern => pattern.test(name)))
        errors.push(`${relativeFile}: React-related package ${name} is not allowed`)

      if (version === 'catalog:' || version === 'catalog:default')
        errors.push(`${relativeFile}: ${name} must use a named catalog`)

      const usesAllowedVersionSource = version.startsWith('catalog:')
        || version.startsWith('workspace:')

      if (!usesAllowedVersionSource)
        errors.push(`${relativeFile}: ${name} must use catalog:<name> or workspace:<range>`)
    }
  }
}

const lockfile = await readFile(join(rootDir, 'pnpm-lock.yaml'), 'utf8')
for (const match of lockfile.matchAll(/^ {2}['"]?(@?[^\s'":@]+)@[^:\n]+:/gm)) {
  if (forbiddenToolPattern.test(match[1]))
    errors.push(`pnpm-lock.yaml: ${match[1]} is not allowed`)
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exitCode = 1
}
else {
  console.log('Package boundaries are valid.')
}
