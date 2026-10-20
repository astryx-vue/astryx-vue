# @astryx-vue/cli

## 0.2.0

### Minor Changes

- [#115](https://github.com/astryx-vue/astryx-vue/pull/115) [`958c17b`](https://github.com/astryx-vue/astryx-vue/commit/958c17bd66db35b01a5d535943168789853bc128) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `composable` 和 `docs` 命令。`composable --list` 和 `composable <Name>` 查组合式函数，详情带参数、返回值和示例；`component --list` 不再混进组合式函数，`component useClipboard` 仍能查到并提示改用新命令。`docs` 列出全部指南和主题，`docs <topic>` 打印正文，接受 `guide/dark-mode`、`themes/tokens` 或唯一的短名字。`search` 把组合式函数单列为 `composable` 域，`--type` 可选 `component`、`composable`、`doc`。未知名字返回 `ERR_UNKNOWN_COMPOSABLE` 或 `ERR_UNKNOWN_TOPIC`，并带上相近的名字。

### Patch Changes

- [#84](https://github.com/astryx-vue/astryx-vue/pull/84) [`f9df031`](https://github.com/astryx-vue/astryx-vue/commit/f9df031010746d5c0b349d269e0a42d40de8e3fe) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 组件说明跟文档站用同一份来源。目录补上示例源码，嵌套的 props、插槽和事件表也会收进来。`pnpm check` 在目录过期，或 core 的组件导出没有文档时失败。

## 0.1.0

### Minor Changes

- [#79](https://github.com/astryx-vue/astryx-vue/pull/79) [`c076bea`](https://github.com/astryx-vue/astryx-vue/commit/c076bea16198312e3a151d045842664f87eecd0e) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Add `@astryx-vue/cli` (`astryx-vue`) for component docs, search, a capability manifest, and `init --features agents`. The command text is generated from the docs site, not a second copy.
  
  `init --features agents` rewrites the managed block on every run and leaves text outside the markers in place.
