---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

新增 `usePanGesture` / `createPanGesture`：把元素上的拖动报成状态、位移和速度，手指走过 10pt 才认领，轻点和长按不会被当成拖动。新增 `useDragToSnapPoints` / `createDragToSnapPoints`：元素沿一条轴被拖动，松手后像 iOS 面板一样停到吸附点上，并提供不用拖动的 `settleTo`。`useSnapPaging` 的手指拖动和触控板横扫改由手势引擎识别，和其他手势统一仲裁；跟手从手指越过起拖距离的那一点算起。
