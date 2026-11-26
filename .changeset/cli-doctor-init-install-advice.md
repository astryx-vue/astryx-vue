---
'@astryx-vue/cli': patch
---

`doctor` 在包没装好时给出修复命令：用项目自己的包管理器，缺 themes 时按项目 core 的版本装（core 钉死版本时加 `-E`），刚 clone 还没装依赖时让你运行项目自己的安装；用 core 的 `<Theme>` 或 `dataset.astryxTheme` 设主题也算设好了。`init` 逐个文件说明做了什么，区块已是最新时不重写文件、只打印 `build` 和 `search`，安装步骤只列还缺的包，写不了文件时说明原因和该改什么；内置的样式指南补上自己写样式时要守的几条。
