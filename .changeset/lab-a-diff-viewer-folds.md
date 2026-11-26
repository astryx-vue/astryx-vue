---
'@astryx-vue/lab': patch
---

实验包 DiffViewer：`createDiffFile` 在线性内存里逐行比较最多 10,000 行改动，更大的改动在片段上标 `isReplacedBlock`；DiffViewer 把整块替换和改动超过 2,000 行的文件折在「Large change: N lines」后面，点 Show full diff 展开，折叠会藏住批注时一开始就展开。
