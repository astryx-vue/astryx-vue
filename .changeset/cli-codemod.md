---
'@astryx-vue/cli': patch
---

upgrade、init、doctor 在项目的任意子目录里运行，也会回到有 package.json 的项目根；项目的 core 比 CLI 新时，upgrade 说明是 CLI 太旧，不再说"已是最新"；扫描文件按固定顺序、不穿过符号链接。升级指南新增 List 的 `edgeCompensation="inline"` 改名 `edge="outset"`。
