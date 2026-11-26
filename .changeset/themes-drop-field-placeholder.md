---
'@astryx-vue/themes': minor
---

删掉各主题里只有一行占位注释的 `<主题>/field.css`。主题入口文件（如 `neutral.css`）不受影响；如果单独引入过 `@astryx-vue/themes/<主题>/field.css`，删掉这行引入即可，它本来就不含任何样式。
