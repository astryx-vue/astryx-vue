#!/usr/bin/env bash
# 手动首发一个还没在 npm 上出现过的包。
#
# 为什么要手动：CI 用 Trusted Publisher 发布，而 Trusted Publisher 是挂在「已经存在」的包上的，
# 一个 npm 上还没有的包没法配。所以第一个版本要有人用自己的 npm 账号发一次。
# 发完之后，去 npmjs.com 这个包的设置里添加 Trusted Publisher（见 RELEASING.md），以后的版本就都走 CI。
#
# 用法（在仓库根目录）：
#   scripts/publish-first-release.sh richtext
#   scripts/publish-first-release.sh richtext --otp=123456      # 账号开了 2FA，把一次性密码带上
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "用法：scripts/publish-first-release.sh <包目录名> [--otp=<一次性密码>]" >&2
  exit 2
fi

dir="$1"
shift
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root/packages/$dir"

name="$(node -p "require('./package.json').name")"
version="$(node -p "require('./package.json').version")"

if [ "$version" = "0.0.0" ]; then
  echo "$name 的版本仍是 0.0.0。请先合并 Version Packages PR，再发布正式版本。" >&2
  exit 1
fi

if [ "$(node -p "Boolean(require('./package.json').private)")" = "true" ]; then
  echo "$name 是 private，不能发布。" >&2
  exit 1
fi

# 已经在 npm 上就别再发：这个脚本只管首发。
if npm view "$name@$version" version --registry https://registry.npmjs.org >/dev/null 2>&1; then
  echo "$name@$version 已经在 npm 上了，不用再发。" >&2
  exit 1
fi

echo "要发布：$name@$version"
if ! npm whoami --registry https://registry.npmjs.org >/dev/null 2>&1; then
  echo "还没登录 npm，先登录（按提示完成 2FA）："
  npm login --registry https://registry.npmjs.org
fi

cd "$root"
pnpm install --frozen-lockfile
pnpm --filter "$name" build

cd "$root/packages/$dir"
# 本机发布拿不到 CI 的身份，所以没有 provenance。
pnpm publish --access public --no-git-checks --provenance=false "$@"

echo
echo "已发布 ${name}@${version}。"
echo "接下来：到 https://www.npmjs.com/package/${name}/access 添加 Trusted Publisher："
echo "  来源 GitHub Actions；用户或组织 astryx-vue；仓库 astryx-vue；工作流文件 release.yml；允许 npm publish。"
