---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

Token 跟进上游一组修复。

- 禁用的 Token 在每种结构的根上都带 `data-disabled`，主题可以据此改样式。禁用的链接型 Token 仍是可聚焦的链接（`role="link"`、`aria-disabled="true"`、没有 `href`），Enter 和空格不再触发，其他按键照常交给调用方。
- 带 `href` 的 Token 点击链接时也会调用 `@click` 监听；点删除按钮不会。
- 可点击 Token 的 `aria-labelledby`、`aria-describedby`、`aria-haspopup`、`aria-expanded`、`aria-pressed` 落到里面的按钮上，筛选标签可以用 `aria-pressed` 表示按下。
- 焦点环只画一个：Token 自己的按钮或链接获得焦点时整颗 Token 画环，删除按钮自己画环。List 的 Item 也只在自己的按钮或链接获得焦点时给整行画环，起止插槽里的控件自己画环。
- 右到左页面上，Token 标签、Badge 标签和 InputGroupText 里没有右到左字母的纯文字保持书写顺序，`https://`、`+3`、`@alice` 不再被重排。

CLI 内置的组件文档跟着更新了 Token、Badge、InputGroup 的说明。
