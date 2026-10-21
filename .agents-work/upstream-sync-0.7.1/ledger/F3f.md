# F3f 实验包：使用文档 · 上游改动台账

范围：96f9917f..v0.7.1 · 共 13 个提交 · 其中破坏性 0 个

每条处理完后打勾，并在条目下注明「已采纳」或「不适用：理由」。

## 破坏性改动

无。

## 新功能 / 修复 / 其它

### feat

- [ ] `fb0b7a99f` feat(lab): explore shared-dialog BottomSheetSwitcher API (#5023)
  - 文件：packages/lab/src/index.ts
  - 还涉及：B3、C8
  - 链接：https://github.com/facebook/astryx/commit/fb0b7a99f198ad92f221b857e5d5f5a44697b912
- [ ] `6e7f89c16` feat(core): promote Bottom Sheet from Lab (#5080)
  - 文件：packages/lab/src/index.ts
  - 还涉及：C8、D4、D5
  - 链接：https://github.com/facebook/astryx/commit/6e7f89c16f52667014f559f4ef9d0e28f43a615c
- [ ] `ecaf7796b` feat(core): promote Stepper from Lab (#5201)
  - 文件：packages/lab/src/__tests__/labApiContractDrift.test.tsx、packages/lab/src/index.ts
  - 测试：packages/lab/src/__tests__/labApiContractDrift.test.tsx
  - 还涉及：B5、C15、D5
  - 链接：https://github.com/facebook/astryx/commit/ecaf7796bd2bad53c8742ed68a0507d3f013e7a8
- [ ] `ea5705c0f` feat(docsite): surface canary-only components (#5583)
  - 文件：packages/lab/astryx.integration.mjs
  - 还涉及：D5、F1a、F1c、F2a、F2c、F3d、F3e、F5
  - 链接：https://github.com/facebook/astryx/commit/ea5705c0f9566bb7d4f61f28e47073a4895d66b8
- [ ] `e983e37f1` feat(lab): MobileTokenizer — touch Tokenizer prototype (#6640)
  - 文件：packages/lab/src/index.ts
  - 还涉及：F3a
  - 链接：https://github.com/facebook/astryx/commit/e983e37f13ee24ff869cc424d5680680baf03b27
- [ ] `06c8fa316` feat(lab): align Drawer dismissal and close control with Dialog (#6877)
  - 文件：packages/lab/src/index.ts
  - 还涉及：F3c
  - 链接：https://github.com/facebook/astryx/commit/06c8fa3165537dedbe67101cfcabbe14f0f82e82
- [ ] `22743455a` feat(richtext): release @astryxdesign/richtext as a stable package (#7224)
  - 文件：packages/lab/src/index.ts
  - 还涉及：C1、C9、F1a、F1b、F1c
  - 链接：https://github.com/facebook/astryx/commit/22743455aa9a4047affcaba9f300184ed657cbc3
- [ ] `0788e9b93` feat(lab): parseUnifiedDiff reads a patch into the DiffViewer file model (#7568)
  - 文件：packages/lab/src/index.ts
  - 还涉及：F3d
  - 链接：https://github.com/facebook/astryx/commit/0788e9b9319f0ad29d666c2df737d99249116d53

### fix

- [ ] `d80e7b727` fix(docsite): register runnable Drawer examples (#6787)
  - 文件：packages/lab/README.md、packages/lab/astryx.integration.mjs
  - 还涉及：F3c
  - 链接：https://github.com/facebook/astryx/commit/d80e7b7273e2dad6d337c8cb6fb876d12308bd1d

### test

- [ ] `63f398dfa` test(core): drop the tautological #4163 doc-contract tests (#5382)
  - 文件：packages/lab/src/__tests__/labApiContractDrift.test.tsx
  - 测试：packages/lab/src/__tests__/labApiContractDrift.test.tsx
  - 还涉及：B6、C1
  - 链接：https://github.com/facebook/astryx/commit/63f398dfa3ae5e22da38be399bd4e2987c8925fb

### docs

- [ ] `aeb66f5a3` docs(lab): prepare Bottom Sheet for promotion (#5078)
  - 文件：packages/lab/src/index.ts
  - 还涉及：C8
  - 链接：https://github.com/facebook/astryx/commit/aeb66f5a32194e95ccfe7fbde573453e8b1c96f9

### 其它

- [ ] `2bdba849d` docsite: unify Lab integration plumbing (admission, automaticity, coverage report) (#6800)
  - 文件：packages/lab/README.md
  - 链接：https://github.com/facebook/astryx/commit/2bdba849d0b6fddda3fb00c5436c1a202f7d0d30
- [ ] `f27f74937` chore(richtext): remove internal-only references from public source and docs (#6975)
  - 文件：packages/lab/src/index.ts
  - 还涉及：B1、F1b、F1c
  - 链接：https://github.com/facebook/astryx/commit/f27f74937a954529f408532a1782ab9602082e4f
