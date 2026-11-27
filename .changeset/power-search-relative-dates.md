---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

PowerSearch 的相对日期条件改成从一组固定选项里挑（1、3、7、14、30 天，1、2、4 周，1、3、6、12 个月，前后两个方向），选中就保存，不再给一个自由输入框；`isPastAllowed`、`isFutureAllowed` 设成 false 会去掉对应方向。新增 `powerSearchSheet` 文案命名空间（中英文），包含触屏底部弹层流程和相对日期选项的文字，原版对应的 `@astryx.powersearch.sheet.*` 翻译也接上了。
