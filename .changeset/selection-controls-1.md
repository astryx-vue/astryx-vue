---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

选择类控件对齐上游：禁用的开关、复选框、单选项、分段、滑块不再运行调用方的处理函数；必填的开关、复选框、单选项在出错前不会被读成无效；禁用或出错的复选框组、单选组把状态写到整组和每个复选框上；Slider 的两个重合滑块能拉开，范围滑块保留调用方的 aria-labelledby，拖动时只有被拖的滑块显示数值，刻度文字下方留够空间；复选框、单选项列表行新增 align，ToggleButton 保持真实按下状态，ToggleButtonGroup 窄屏换行，单选圈和开关拇指始终是圆的。
