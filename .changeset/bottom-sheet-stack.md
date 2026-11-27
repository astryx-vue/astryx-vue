---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

BottomSheet 按打开顺序叠放，后打开的盖在上面、下面那张往后退，整叠只有一层遮罩；在开着的那张里关掉它、同时打开另一张时，新的一张原地替换它（上一张比新的高时先往下移对齐，再淡出），BottomSheetSwitcher 的每一步改用各自的原生对话框并标为已废弃，文档站在侧栏、总览卡片和文档页标题旁标出「已废弃」。
