import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { listPublicPackages } from './list-public-packages.mjs'

/**
 * 核验本次报告的包，以及仓库当前清单里的所有公开版本。
 * Changesets 可能给某个包建 Release 却漏在 published-packages 输出里；
 * 只信那份输出会让这个包根本没经过 npm 核验。
 */
export function verificationPackages(root, reportedPackages) {
  const reported = Array.isArray(reportedPackages) ? reportedPackages : []
  const current = listPublicPackages(root).map((dir) => {
    const manifest = JSON.parse(readFileSync(join(root, 'packages', dir, 'package.json'), 'utf8'))
    return { name: manifest.name, version: manifest.version }
  })
  const entries = new Map(current.map(pkg => [`${pkg.name}@${pkg.version}`, { ...pkg, reported: false }]))
  for (const pkg of reported)
    entries.set(`${pkg.name}@${pkg.version}`, { ...pkg, reported: true })
  return [...entries.values()]
}
