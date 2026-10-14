#!/usr/bin/env bash
# changesets 真正 publish 之后，把 main 合并回 dev。
# 无冲突就普通 push（不 rebase、不强推）。
# push 被分支保护拒绝，或者合并有冲突，就打开或更新 main → dev 的 PR。
# 已有同名开放 PR 时不重复开。

set -euo pipefail

repo="${GITHUB_REPOSITORY:?}"
owner="${GITHUB_REPOSITORY_OWNER:?}"
title="chore: sync main into dev"
body_file=""

export GH_PROMPT_DISABLED=1
export GIT_TERMINAL_PROMPT=0

cleanup() {
  if [ -n "$body_file" ]; then
    rm -f "$body_file"
  fi
}
trap cleanup EXIT

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

# + 只更新本地的远程跟踪分支，方便 fetch 跟上远端。不会强推。
git fetch origin \
  +refs/heads/main:refs/remotes/origin/main \
  +refs/heads/dev:refs/remotes/origin/dev

git checkout -B dev origin/dev

main_sha="$(git rev-parse origin/main)"
dev_sha="$(git rev-parse origin/dev)"

echo "准备把 main (${main_sha}) 合并进 dev (${dev_sha})。"

find_sync_pr() {
  gh pr list \
    --repo "$repo" \
    --base dev \
    --head main \
    --state open \
    --limit 50 \
    --json number,title,headRepositoryOwner \
    --jq "[.[] | select(.title == \"${title}\" and .headRepositoryOwner.login == \"${owner}\") | .number] | first // \"\""
}

close_sync_pr() {
  local number
  number="$(find_sync_pr)" || {
    echo "::warning::没能查询已有的同步 PR。"
    return 0
  }
  if [ -z "$number" ]; then
    return 0
  fi
  echo "main 已经在 dev 里，关闭同步 PR #${number}。"
  gh pr close "$number" --repo "$repo" --comment "main 已经合并进 dev，这个同步 PR 关掉。" \
    || echo "::warning::同步 PR #${number} 没能自动关掉。"
}

open_or_update_pr() {
  local reason="$1"
  local number url

  body_file="$(mktemp)"
  cat >"$body_file" <<EOF
changesets 已经发布成功。这个 PR 把 main 合并回 dev，补上 Version Packages 那次提交。请合并到 dev。

直接推送没有成功：${reason}

main: ${main_sha}
dev: ${dev_sha}

没有冲突就合并这个 PR。有冲突就在这个 PR 里解决后再合并。
EOF

  # 本地 dev 可能还留着没推上去的合并提交。先离开它，再用 --head main，避免 gh 把这次合并强行推上去。
  git checkout --detach origin/main

  number="$(find_sync_pr)"
  if [ -n "$number" ]; then
    echo "已有同名开放 PR #${number}，更新说明，不重复创建。"
    gh pr edit "$number" --repo "$repo" --body-file "$body_file"
    url="$(gh pr view "$number" --repo "$repo" --json url --jq .url)"
    echo "已更新 ${url}"
    echo "::warning::不能直接把 main 推到 dev，已更新 ${url}"
    return 0
  fi

  url="$(gh pr create --repo "$repo" --base dev --head main --title "$title" --body-file "$body_file")"
  echo "已打开 ${url}"
  echo "::warning::不能直接把 main 推到 dev，已打开 ${url}"
}

if git merge-base --is-ancestor origin/main HEAD; then
  echo "dev 已经包含 main，不用同步。"
  close_sync_pr
  exit 0
fi

if ! git merge --no-edit -m "$title" origin/main; then
  git merge --abort || true
  open_or_update_pr "合并 main 到 dev 时有冲突。"
  exit 0
fi

if git push origin HEAD:dev; then
  echo "已把 main 合并进 dev 并推送。"
  close_sync_pr
  exit 0
fi

open_or_update_pr "推送到 dev 被拒绝，多半是分支保护不允许直接推。"
