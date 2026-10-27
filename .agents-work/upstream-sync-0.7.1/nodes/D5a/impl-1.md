# D5a 实现记录（总控接手收尾）

worker 完成了前 3 项，提交了 3 次：变量前缀加检查、settings-dialog 版式、补 4 个模板。截图对照那一步卡了约 50 分钟（在查图标为什么不显示），总控叫停后接手。

## 总控补修

- **50 张演示图片缺失。** 模板引用的 `/template-assets/*` 有 50 张不在仓库里，画廊、商品、hero 类模板一直是空白。worker 当成图标问题在查，其实是图片 404。从上游 `apps/docsite/public/template-assets` 补齐（约 48 MB）。
- **原版标为未完成的模板。** 上游 `incident-console`、`messaging-shell`、`table` 是 `isReady: false`，`login`、`table`、`theme-showcase` 是 `isHiddenFromOverview: true`。照原版的做法：
  - 演练场菜单和 `guide/templates` 索引不列出这些模板（`theme-showcase` 例外，原版菜单把它固定在第一项）；用 `?template=` 仍然能打开。
  - 命令行把上游未完成的 3 个标成未就绪，原因写「原版仍标为未完成」，`template` 拒绝复制，`build` 排序靠后。
- `build "login page"` 现在推荐 `login`（上游的基础登录页），`login-card` 排第二。这和上游一致，测试期望随之更新。

## 截图检查

57 个模板都在 1440×900 下截图看过：没有空白页、布局崩坏或缺图。`shell-*` 三个模板的内容区是灰色占位块，和上游源码一致（上游就用 `Card variant="muted"` 拼的骨架）。

## 没做

- 和原版逐个截图对照。本机 Clash 代理断了，原版站点打不开。代理恢复后可以补一轮。
- `is-label-hidden`：模板里 30 个文件用到。TextInput、TextArea、Slider 继承 `FieldLabelProps`，里面有 `isLabelHidden`，属性名已经统一，没有发现标签没隐藏的情况。
