import type { DemoModule } from '../demo-infra/defineDemo'
import type { DemoMeta } from '../demo-infra/demoMeta'

const metaModules = import.meta.glob<DemoMeta>(
  './*/meta.ts',
  { eager: true, import: 'meta' },
)

/**
 * The demo shown on the catalog card for each component. The card picks it up
 * from `demos/<slug>/meta.ts`.
 */
export const componentDemos: Record<string, DemoModule> = Object.fromEntries(
  Object.values(metaModules).flatMap(meta => meta.demo ? [[meta.slug, meta.demo] as const] : []),
)

/** 总览卡片优先用专用静态构图，其他组件仍复用详情页 demo。 */
export const componentCardDemos: Record<string, DemoModule> = Object.fromEntries(
  Object.values(metaModules).flatMap((meta) => {
    const demo = meta.cardDemo ?? meta.demo
    return demo ? [[meta.slug, demo] as const] : []
  }),
)
