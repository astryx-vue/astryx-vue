---
'@astryx-vue/cli': patch
---

`doctor` 新增 `button-actions` 检查：读项目自己 `.vue` 文件的模板，列出按下后什么都不做的 core `Button`、`IconButton`（没有 `@click`、`click-action`、`href` 或提交类型，处理函数是空的，或链接哪儿也不去），只在周围没有东西能接管按下时才判，只警告不让 doctor 失败。
