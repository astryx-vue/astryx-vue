---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

FileInput 一次挑了几个不合格的文件时，状态提示按当前语言列出每个文件和原因，不再只说第一个；InternationalizationProvider 漏写 `locale` 时，开发环境直接报错并给出改法。
