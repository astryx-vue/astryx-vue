---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

Table 对齐上游一批无障碍和外观修正：列宽把手按列头可见文字命名、不再混进列头名字，并念出实际列宽和合理的范围；树形表格改用披露模式（行上不再带 `aria-level`、`aria-expanded`，展开按钮用 `aria-controls` 指向子行）；行展开和树形插件新增 `getRowLabel`，按钮名字可以带上行名；`useTableRowIndex` 的 `data` 改为可选；数据模式的列标题跟着 `textOverflow` 折行，窄列里标题先省略、排序和筛选按钮留在格子里；手写行列的表格放不下时横向滚动，不再把单词压成一个字母宽；固定列自己画行分隔线；行带上 `table-row` 主题目标的 `parity`、`striped`、`selected` 状态；滚动区和树形按钮画共用的焦点环，手机上横向能滚时藏着内容的一侧会淡出；Invalid Date 显示为空格子，排序时当缺失值。
