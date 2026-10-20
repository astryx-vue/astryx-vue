// 列出 packages/ 下所有要发布的包（package.json 里没有 private: true 的目录），按目录名排序。
// 发布流水线（GitHub Packages 双发、补 tag、publint）都从这里拿包清单，新增包不用改脚本。
// 直接运行时每行输出一个目录名，给 shell 循环用。
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))

/**
 * @param {string} [root] 仓库根目录
 * @returns {string[]} packages/ 下要发布的目录名，例如 ['cli', 'core', 'themes']
 */
export function listPublicPackages(root = ROOT) {
  const packagesDir = join(root, 'packages')
  return readdirSync(packagesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter((dir) => {
      const manifest = join(packagesDir, dir, 'package.json')
      return existsSync(manifest) && JSON.parse(readFileSync(manifest, 'utf8')).private !== true
    })
    .sort()
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
  process.stdout.write(`${listPublicPackages().join('\n')}\n`)
