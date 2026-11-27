---
'@astryx-vue/core': minor
'@astryx-vue/richtext': patch
'@astryx-vue/cli': patch
---

富文本里每个段落、标题、引用和列表项按自己文字的方向排版（编辑器和只读视图一致），没有强方向字符的块跟着文档；列表缩进改放在每一项上，围栏代码块每行各按自己的方向读。代码块标题栏的长标签改为折行，代码块按标题栏画出来的高度留位置、按它的宽度定最小宽度。core 导出 `firstStrongDirection`，并补全了阿拉伯文标记、印度系数字等字符的强弱判定（Markdown 同步受益）。
