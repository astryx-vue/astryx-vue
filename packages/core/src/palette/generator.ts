/**
 * 色阶生成器：一份请求（几组种子色、锚点、鲜艳度、中性色取向、模式策略、色阶位置、配方）
 * 进，一份确定的候选调色板出，带每条色阶和跨色族的诊断。
 * 实现按职责分在 generatorBase（常量、色相和色度的算法）、generatorRamp（单族色阶）
 * 和 generatorRequest（请求的规范化与整套生成）。
 */
export * from './generatorBase'
export * from './generatorRamp'
export * from './generatorRequest'
