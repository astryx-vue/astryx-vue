---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

可调整面板的手感对齐上游：拿到 `useResizable` 返回值的 LayoutPanel 收起、展开时从朝分隔条的那条边滑合滑开；拖动途中面板停在最小尺寸，松手低于 `collapsedSize` 或朝收起方向甩一下才收起，收起按松手速度用弹簧滑走；指针把收起的面板拖开时跟手不滑；拖过上下限时分隔条像橡皮筋一样多走最多 8 像素，松手弹回；分隔条叠在滑动的内容上方，`aria-valuenow` 不再超出上下限。
