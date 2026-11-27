---
'@astryx-vue/charts': patch
---

图表包的类型声明用到了 d3-scale 和 d3-shape 的类型，现在随包一起安装对应的 `@types`，没开 `skipLibCheck` 的项目不再报找不到类型。
