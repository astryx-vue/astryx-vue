---
'@astryx-vue/cli': patch
---

命令行 search 在得分相同时让回答了更多查询词的条目排前面，复数的家族词（如 tabs）会列出它的各个部分，用 PascalCase 写的名字也能在文档正文里按词找到；查不到名字时会指向有这个名字的命令（docs、template、component、composable 互相提示），别的库的叫法不再直接打开组件而是作为第一条建议。
