import { devPropError, isDevBuild } from '../composables/internal/devBuild.js'

/**
 * 开发期检查：Selector、MultiSelector 的 `options` 必须是数组。
 * 它们不读 `<option>` 子节点，缺了这个属性时点名组件、属性和改法，
 * 免得调用方只看到内部的 TypeError。生产构建里不做这项检查。
 */
export function assertOptionsArray(component: 'Selector' | 'MultiSelector', options: unknown): void {
  if (isDevBuild() && !Array.isArray(options)) {
    throw devPropError(
      component,
      'options',
      `must be an array of options, for example :options="[{ value: 'nyc', label: 'New York' }]". ${component} does not read <option> children.`,
    )
  }
}
