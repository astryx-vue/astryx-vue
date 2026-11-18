---
'@astryx-vue/charts': patch
---

3D 图表和径向图表写进 SVG 的坐标舍到 3 位小数（3D 的深度舍到 6 位），和 d3-shape 生成路径的精度一致。`Math.sin`、`Math.cos` 的结果由 JS 引擎自行近似，Node 和浏览器可能只差最后一位，之前服务端渲染的坐标和 hydration 算出的对不上。
