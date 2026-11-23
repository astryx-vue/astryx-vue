import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

const BOT = ['-c', 'user.name=github-actions[bot]', '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com']

function defaultGit(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
}

/**
 * 在临时 worktree 里更新汇总 PR 的清单文件，不碰当前工作区。
 *
 * resume 为真（PR 还开着）时接着远端分支往上提交，保留大家在 PR 里的改动（比如改 syncedTo）；
 * 否则从 base 重新开分支并强推，上一轮合并后的旧分支直接作废。
 * render(previous) 拿到分支上现有的清单内容，返回新内容。
 * 返回 { changed, content }：changed 为假表示清单没变，什么都没推。
 */
export function updatePendingBranch({ repoDir, branch, base, file, render, resume, message, git = defaultGit }) {
  const start = resume ? branch : base
  git(['fetch', '--quiet', '--no-tags', 'origin', `+refs/heads/${start}:refs/remotes/origin/${start}`], repoDir)
  const worktree = mkdtempSync(join(tmpdir(), 'upstream-sync-'))
  try {
    git(['worktree', 'add', '--quiet', '--force', '-B', branch, worktree, `origin/${start}`], repoDir)
    const target = join(worktree, file)
    const previous = existsSync(target) ? readFileSync(target, 'utf8') : ''
    const content = render(previous)
    if (content === previous)
      return { changed: false, content }
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, content)
    git(['add', file], worktree)
    git([...BOT, 'commit', '--quiet', '-m', message], worktree)
    git(['push', '--quiet', ...(resume ? [] : ['--force']), 'origin', `HEAD:refs/heads/${branch}`], worktree)
    return { changed: true, content }
  }
  finally {
    git(['worktree', 'remove', '--force', worktree], repoDir)
    rmSync(worktree, { recursive: true, force: true })
  }
}
