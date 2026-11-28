---
'@astryx-vue/cli': patch
---

`astryx-vue search` 的结果会标出已废弃的组件：文本输出在名字后写「（已废弃）」，并给出改用哪个组件和迁移说明的第一句；`--json` 里带 `deprecated: { replacement, description }`。CLI 自带的组件目录也记下了每个废弃组件的替代组件和迁移说明。文档站搜索里，废弃组件的结果行同样带「已废弃」标记。
