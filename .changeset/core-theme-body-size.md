---
'@astryx-vue/core': patch
---

`Theme` 里没写字号、只继承字号的文字改用主题的正文字号（`--astryx-text-body-size`，默认 14px），不再是浏览器的 16px，同上游 dda98593dc。Card、Stack 里的纯文本和 `Text type="inherit"` 都随主题字号走。
