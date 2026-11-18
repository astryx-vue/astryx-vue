---
'@astryx-vue/core': patch
---

CodeBlock 服务端渲染后 hydration 不再出现差异。之前 CodeBlock 在 setup 里检测浏览器是否支持 CSS Custom Highlight API：服务端只能用 span 着色，Chromium 一进来就选 Highlight API，两边渲染出的行结构不同。现在挂载前一律用 span，挂载后再换成浏览器支持的方式。
