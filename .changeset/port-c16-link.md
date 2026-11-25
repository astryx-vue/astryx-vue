---
'@astryx-vue/core': patch
'@astryx-vue/richtext': patch
'@astryx-vue/cli': patch
---

Link 跟进上游的一组修复。

- 禁用的 Link 不会被调用方传的 `role` 或 `aria-disabled` 换掉禁用状态，读屏仍然读出「已禁用」；调用方传的 `tabindex` 照常生效。启用时，调用方的 `role`、`tabindex`、`aria-disabled`、`aria-label` 也都能落到根元素上。
- 根元素带上 `data-color`，始终和 `color` 一致，调用方传的同名值不会盖掉它。
- 放在设了 `maxLines` 的 Text 里的链接会并入文字的行里，外面的截断能从链接中间切开。
- 没有断点的长标签（比如一串网址）在窄栏里换行，不再撑出容器；按钮形态的 Link 换行后和锚点一样跟随外面的对齐；设了 `maxLines` 的链接在弹性行里也能收窄并画出省略号。
- RichTextEditor 自动识别邮箱时，匹配耗时和文字长度成正比，粘贴一长串哈希或 base64 不会让页面卡住。
