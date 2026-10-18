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
