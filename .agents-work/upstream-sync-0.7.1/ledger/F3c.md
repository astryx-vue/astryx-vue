# F3c 实验包：浮层与引导 · 上游改动台账

范围：96f9917f..v0.7.1 · 共 16 个提交 · 其中破坏性 0 个

每条处理完后打勾，并在条目下注明「已采纳」或「不适用：理由」。

## 破坏性改动

无。

## 新功能 / 修复 / 其它

### feat

- [ ] `c2bb31b61` feat(lab): define Drawer as a responsive side overlay (#5246)
  - 文件：packages/lab/src/Drawer/Drawer.doc.mjs、packages/lab/src/Drawer/Drawer.test.tsx、packages/lab/src/Drawer/Drawer.tsx
  - 规范文档：packages/lab/src/Drawer/Drawer.doc.mjs
  - 测试：packages/lab/src/Drawer/Drawer.test.tsx
  - 链接：https://github.com/facebook/astryx/commit/c2bb31b61fb88f3ffaf86d91f1c94f23fadc52a0
- [ ] `1fdecb1ae` feat(Selector): add selector-option-row theme target on the option row (#5179)
  - 文件：packages/lab/src/Drawer/Drawer.test.tsx
  - 测试：packages/lab/src/Drawer/Drawer.test.tsx
  - 还涉及：C3、C7、C8、F3a
  - 链接：https://github.com/facebook/astryx/commit/1fdecb1ae6c3e7015ecaf2022f7d63b35f042c74
- [ ] `ea0483449` feat(theme): add appearance nesting tokens (#5963)
  - 文件：packages/lab/src/Drawer/Drawer.tsx
  - 还涉及：B1、C1、C2、C5、C7、C8、C9、C10、C11、C12、C13、C14、C16、D4、F1b、F2b、F3a、F3b、F3d
  - 链接：https://github.com/facebook/astryx/commit/ea0483449dcbdd69aed43aa0d4ba9d6f57f54447
- [ ] `06c8fa316` feat(lab): align Drawer dismissal and close control with Dialog (#6877)
  - 文件：packages/lab/blocks/DrawerFullWidthMobile.doc.mjs、packages/lab/blocks/DrawerFullWidthMobile.tsx、packages/lab/blocks/DrawerMobileReveal.doc.mjs、packages/lab/blocks/DrawerMobileReveal.tsx、packages/lab/blocks/DrawerScrim.doc.mjs、packages/lab/blocks/DrawerScrim.tsx、packages/lab/blocks/DrawerShowcase.doc.mjs、packages/lab/blocks/DrawerShowcase.tsx 等 20 个
  - 规范文档：packages/lab/blocks/DrawerFullWidthMobile.doc.mjs、packages/lab/blocks/DrawerMobileReveal.doc.mjs、packages/lab/blocks/DrawerScrim.doc.mjs、packages/lab/blocks/DrawerShowcase.doc.mjs、packages/lab/blocks/DrawerStart.doc.mjs、packages/lab/blocks/DrawerWidths.doc.mjs、packages/lab/src/Drawer/Drawer.doc.mjs、packages/lab/src/Drawer/Drawer.spec.md、packages/lab/src/Drawer/DrawerHeader.doc.mjs
  - 测试：packages/lab/src/Drawer/Drawer.test.tsx、packages/lab/src/Drawer/DrawerHeader.test.tsx
  - 还涉及：F3f
  - 链接：https://github.com/facebook/astryx/commit/06c8fa3165537dedbe67101cfcabbe14f0f82e82
- [ ] `7189141b9` feat(lab): Drawer is a container, like Dialog (#6885)
  - 文件：packages/lab/blocks/DrawerFullWidthMobile.doc.mjs、packages/lab/blocks/DrawerFullWidthMobile.tsx、packages/lab/blocks/DrawerMobileReveal.doc.mjs、packages/lab/blocks/DrawerMobileReveal.tsx、packages/lab/blocks/DrawerScrim.doc.mjs、packages/lab/blocks/DrawerScrim.tsx、packages/lab/blocks/DrawerShowcase.doc.mjs、packages/lab/blocks/DrawerShowcase.tsx 等 17 个
  - 规范文档：packages/lab/blocks/DrawerFullWidthMobile.doc.mjs、packages/lab/blocks/DrawerMobileReveal.doc.mjs、packages/lab/blocks/DrawerScrim.doc.mjs、packages/lab/blocks/DrawerShowcase.doc.mjs、packages/lab/blocks/DrawerStart.doc.mjs、packages/lab/blocks/DrawerWidths.doc.mjs、packages/lab/src/Drawer/Drawer.doc.mjs、packages/lab/src/Drawer/Drawer.spec.md、packages/lab/src/Drawer/DrawerHeader.doc.mjs
  - 测试：packages/lab/src/Drawer/Drawer.test.tsx
  - 还涉及：B1、C14
  - 链接：https://github.com/facebook/astryx/commit/7189141b93255b7fe57e0faa5522c3fb113dc51e

### fix

- [ ] `0c6ab035b` fix(core,lab): reset container padding custom properties on overlay elements (#5208) (#5209)
  - 文件：packages/lab/src/Drawer/Drawer.test.tsx、packages/lab/src/Drawer/Drawer.tsx
  - 测试：packages/lab/src/Drawer/Drawer.test.tsx
  - 还涉及：C7、C8、C13
  - 链接：https://github.com/facebook/astryx/commit/0c6ab035b4deef4df0dca436e4c3bd3f7669be3b
- [ ] `4aacbbedc` fix(core,lab): stop the container padding system at every overlay boundary (#5231)
  - 文件：packages/lab/src/Drawer/Drawer.tsx
  - 还涉及：B1、B4、C7、C8、C13、C14
  - 链接：https://github.com/facebook/astryx/commit/4aacbbedc7c1cf1e80104fdb01a11f613ec45e98
- [ ] `9ebd45fb3` fix(Drawer): stop the panel repainting into the page after close() (#5549)
  - 文件：packages/lab/src/Drawer/Drawer.test.tsx、packages/lab/src/Drawer/Drawer.tsx、packages/lab/src/Drawer/useDrawerDialogPresence.ts
  - 测试：packages/lab/src/Drawer/Drawer.test.tsx
  - 链接：https://github.com/facebook/astryx/commit/9ebd45fb32641af6dfa03c836605d522e703e5fe
- [ ] `4ec26d757` fix(layer): reset text and whole surface membership (#6457)
  - 文件：packages/lab/src/Drawer/Drawer.tsx
  - 还涉及：B4、B5、B6、C1、C2、C3、C6、C7、C8、C10、C11、C12、C13、C14、C15、C16
  - 链接：https://github.com/facebook/astryx/commit/4ec26d75769d0b90ee2c85f86e6b6c112b26f0d3
- [ ] `189056a43` fix(lab): harden Drawer layer lifecycle (#6073)
  - 文件：packages/lab/src/Drawer/Drawer.doc.mjs、packages/lab/src/Drawer/Drawer.spec.md、packages/lab/src/Drawer/Drawer.test.tsx、packages/lab/src/Drawer/Drawer.tsx、packages/lab/src/Drawer/useDrawerDialogPresence.ts
  - 规范文档：packages/lab/src/Drawer/Drawer.doc.mjs、packages/lab/src/Drawer/Drawer.spec.md
  - 测试：packages/lab/src/Drawer/Drawer.test.tsx
  - 还涉及：B4、C7
  - 链接：https://github.com/facebook/astryx/commit/189056a433c133bf305cc8cae91b93eee0acee39
- [ ] `d80e7b727` fix(docsite): register runnable Drawer examples (#6787)
  - 文件：packages/lab/blocks/DrawerFullWidthMobile.doc.mjs、packages/lab/blocks/DrawerFullWidthMobile.tsx、packages/lab/blocks/DrawerMobileReveal.doc.mjs、packages/lab/blocks/DrawerMobileReveal.tsx、packages/lab/blocks/DrawerScrim.doc.mjs、packages/lab/blocks/DrawerScrim.tsx、packages/lab/blocks/DrawerShowcase.doc.mjs、packages/lab/blocks/DrawerShowcase.tsx 等 13 个
  - 规范文档：packages/lab/blocks/DrawerFullWidthMobile.doc.mjs、packages/lab/blocks/DrawerMobileReveal.doc.mjs、packages/lab/blocks/DrawerScrim.doc.mjs、packages/lab/blocks/DrawerShowcase.doc.mjs、packages/lab/blocks/DrawerStart.doc.mjs、packages/lab/blocks/DrawerWidths.doc.mjs、packages/lab/src/Drawer/Drawer.doc.mjs
  - 还涉及：F3f
  - 链接：https://github.com/facebook/astryx/commit/d80e7b7273e2dad6d337c8cb6fb876d12308bd1d
- [ ] `94bdc8e8b` fix: reset TransferListSelector drafts, Tour steps, and Lightbox zoom during render (#7351)
  - 文件：packages/lab/src/Tour/Tour.test.tsx、packages/lab/src/Tour/Tour.tsx
  - 测试：packages/lab/src/Tour/Tour.test.tsx
  - 还涉及：C7、F3a
  - 链接：https://github.com/facebook/astryx/commit/94bdc8e8b128e28d3abad9e8c1fe2d0b509403e6

### docs

- [ ] `b130e495e` docs(Drawer): record current Lab contract (#6160)
  - 文件：packages/lab/src/Drawer/Drawer.spec.md
  - 规范文档：packages/lab/src/Drawer/Drawer.spec.md
  - 链接：https://github.com/facebook/astryx/commit/b130e495e5141b03706ac5c680a01e929730c1b2
- [ ] `7218530af` docs(lab): close the Drawer docsite gap ahead of promotion (#6770)
  - 文件：packages/lab/src/Drawer/Drawer.doc.mjs
  - 规范文档：packages/lab/src/Drawer/Drawer.doc.mjs
  - 链接：https://github.com/facebook/astryx/commit/7218530af1b0fabb98f2c1f5fb7079ed83dc6af0
- [ ] `ab8805fbd` docs(lab): render DrawerHeader on the docsite (#7213)
  - 文件：packages/lab/blocks/DrawerHeaderShowcase.doc.mjs、packages/lab/blocks/DrawerHeaderShowcase.tsx、packages/lab/blocks/DrawerHeaderSubtitleEndContent.doc.mjs、packages/lab/blocks/DrawerHeaderSubtitleEndContent.tsx、packages/lab/blocks/DrawerHeaderWithCloseButton.doc.mjs、packages/lab/blocks/DrawerHeaderWithCloseButton.tsx
  - 规范文档：packages/lab/blocks/DrawerHeaderShowcase.doc.mjs、packages/lab/blocks/DrawerHeaderSubtitleEndContent.doc.mjs、packages/lab/blocks/DrawerHeaderWithCloseButton.doc.mjs
  - 链接：https://github.com/facebook/astryx/commit/ab8805fbd3d0edde34c8ae488d99fd29b246b994

### 其它

- [ ] `6e6b9b476` revert(theme): restore local stacking contracts (#6031)
  - 文件：packages/lab/src/Drawer/Drawer.tsx
  - 还涉及：B1、C1、C2、C5、C7、C8、C9、C10、C11、C12、C13、C14、C16、D4、F1b、F2b、F3a、F3b、F3d
  - 链接：https://github.com/facebook/astryx/commit/6e6b9b476713156899fc8bd2107f3f3ee2d26a90
