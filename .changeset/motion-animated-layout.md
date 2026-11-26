---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

新增 `useAnimatedLayout`：把它返回的句柄传给 `Collapsible`、`TreeList` 的 `animatedLayout`，展开收起时后面的内容会滑到新位置，而不是一下子跳过去。
