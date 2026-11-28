#!/bin/bash
# 用法：verify-merged.sh <分支> <vitest 路径...>
# 在专用 worktree（.claude/worktrees/verify-tmp）里把分支和最新 main 合起来，跑包检查、类型检查、lint 和指定的测试，
# 最后重新生成 catalog.json 和 core 的 index.ts：合起来以后生成物有变化（regen 一行不为空），说明要让分支重新生成再合。
# vitest 路径要写到具体目录或文件（例如 packages/core/src/Drawer），写不存在的路径会悄悄只跑到别的文件。
set -u
br=$1; shift
root=$(git rev-parse --path-format=absolute --git-common-dir)/..
wt=$root/.claude/worktrees/verify-tmp
[ -d "$wt" ] || git -C "$root" worktree add -q --detach "$wt" origin/main
cd "$wt"
git fetch -q origin
git checkout -q -B verify-tmp-br origin/$br
if ! git merge -q --no-edit origin/main >/tmp/vm-merge.log 2>&1; then echo "MERGE CONFLICT"; git diff --name-only --diff-filter=U; exit 2; fi
pnpm install --frozen-lockfile >/dev/null 2>&1
pnpm check:packages >/tmp/vm-check.log 2>&1; echo check=$?
pnpm typecheck >/tmp/vm-tc.log 2>&1; echo tc=$?
pnpm lint >/tmp/vm-lint.log 2>&1; echo lint=$?
pnpm vitest run "$@" 2>&1 | grep -E 'Test Files|Tests |FAIL' | head
pnpm --filter @astryx-vue/cli generate >/dev/null 2>&1
pnpm sync >/dev/null 2>&1
echo "regen: $(git status --short | tr '\n' ' ')"
git checkout -q -f --detach origin/main
