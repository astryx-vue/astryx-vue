---
'@astryx-vue/core': patch
---

`createMarkdownFrontmatter` 交给 `parse` 的是普通对象，所以 `parse: fields => fields` 这种原样返回能被当作合法元数据；此前记录没有原型，校验不过，页面会退回成正文并继续显示 frontmatter。叫 `__proto__` 的字段仍是普通字段，不会碰原型。
