import type { UpstreamMapPart } from './types.js'

const operatorNames = [
  'contains',
  'notContains',
  'startsWith',
  'notStartsWith',
  'endsWith',
  'notEndsWith',
  'is',
  'isNot',
  'equals',
  'notEquals',
  'greaterThan',
  'lessThan',
  'greaterThanOrEqual',
  'lessThanOrEqual',
  'before',
  'after',
  'between',
  'isTrue',
  'isFalse',
  'isAnyOf',
  'isNoneOf',
] as const

const valueNames = [
  'value',
  'values',
  'time',
  'date',
  'relativeDate',
  'startDate',
  'endDate',
  'entities',
  'searchPlaceholder',
  'enterValuePlaceholder',
  'addValuesPlaceholder',
  'enterNumberPlaceholder',
  'selectValuesPlaceholder',
] as const

const editorNames = [
  'field',
  'operator',
  'addFilter',
  'removeFilter',
  'group',
  'groupOperator',
  'delete',
  'cancel',
  'apply',
] as const

const sheetNames = [
  'filtersTitle',
  'addFilter',
  'noFilters',
  'noFiltersInDraft',
  'noFiltersDescription',
  'clearAll',
  'clearAllTitle',
  'clearAllDescription',
  'clearAllConfirm',
  'clearAllCancel',
  'done',
  'discardTitle',
  'discardDescription',
  'keepEditing',
  'discardConfirm',
  'search',
  'searchResults',
  'searchFields',
  'searchFieldsPlaceholder',
  'ungroupedFields',
  'noMatchingFields',
  'tryDifferentSearch',
  'noResults',
  'filterUnavailable',
] as const

const sheetRelativeNames = [
  'relativeDaysAgo',
  'relativeDaysFromNow',
  'relativeWeeksAgo',
  'relativeWeeksFromNow',
  'relativeMonthsAgo',
  'relativeMonthsFromNow',
] as const

function namedTargets(keyPrefix: string, pathPrefix: string, names: readonly string[]): UpstreamMapPart {
  return Object.fromEntries(names.map(name => [`${keyPrefix}.${name}`, [{ path: `${pathPrefix}.${name}` }]]))
}

/** PowerSearch 与 CommandPalette。 */
export const searchUpstreamMap: UpstreamMapPart = {
  '@astryx.powersearch.label': [{ path: 'powerSearch.label' }],
  '@astryx.powersearch.placeholder': [{ path: 'powerSearch.placeholder' }],
  '@astryx.powersearch.token.fieldOperator': [{ path: 'powerSearch.token.fieldOperator', args: ['field', 'operator'] }],
  '@astryx.powersearch.token.labelValue': [{ path: 'powerSearch.token.labelValue', args: ['label', 'value'] }],
  '@astryx.powersearch.allFiltersRemoved': [{ path: 'powerSearch.allFiltersRemoved' }],
  '@astryx.powersearch.editableFiltersRemoved': [{ path: 'powerSearch.editableFiltersRemoved' }],
  '@astryx.powersearch.resultCount': [{ path: 'powerSearch.resultCount', args: ['count'] }],
  '@astryx.powersearch.valueEditor.itemsCount': [{ path: 'powerSearch.itemsCount', args: ['count'] }],
  '@astryx.powersearch.valueEditor.entitiesCount': [{ path: 'powerSearch.entitiesCount', args: ['count'] }],
  '@astryx.powersearch.valueEditor.filtersCount': [{ path: 'powerSearch.filtersCount', args: ['count'] }],
  '@astryx.powersearch.valueEditor.dateRange': [{ path: 'powerSearch.dateRange' }],
  ...namedTargets('@astryx.powersearch.editor', 'powerSearch.editor', editorNames),
  ...namedTargets('@astryx.powersearch.operator', 'powerSearch.operators', operatorNames),
  ...namedTargets('@astryx.powersearch.valueEditor', 'powerSearch.value', valueNames),
  ...namedTargets('@astryx.powersearch.sheet', 'powerSearchSheet', sheetNames),
  ...Object.fromEntries(sheetRelativeNames.map(name => [
    `@astryx.powersearch.sheet.${name}`,
    [{ path: `powerSearchSheet.${name}`, args: ['count'] }],
  ])),
  '@astryx.powersearch.sheet.removeFilter': [{ path: 'powerSearchSheet.removeFilter', args: ['field'] }],
  '@astryx.powersearch.sheet.fieldOperator': [{ path: 'powerSearchSheet.fieldOperator', args: ['field', 'operator'] }],
  '@astryx.powersearch.sheet.labelValue': [{ path: 'powerSearchSheet.labelValue', args: ['label', 'value'] }],

  '@astryx.commandPalette.label': [{ path: 'commandPalette.label' }],
  '@astryx.commandPalette.emptySearch': [
    { path: 'commandPalette.emptySearch' },
    { path: 'powerSearch.empty' },
  ],
  '@astryx.commandPalette.emptyBootstrap': [{ path: 'commandPalette.emptyBootstrap' }],
  '@astryx.commandPalette.input.placeholder': [{ path: 'commandPalette.placeholder' }],
  '@astryx.commandPalette.input.label': [{ path: 'commandPalette.inputLabel' }],
  '@astryx.commandPalette.list.label': [{ path: 'commandPalette.listLabel' }],
  '@astryx.commandPalette.loading': [{ path: 'commandPalette.loading' }],
  '@astryx.commandPalette.noResultsFor': [{ path: 'commandPalette.noResultsFor', args: ['query'] }],
  '@astryx.commandPalette.resultCount': [{ path: 'commandPalette.resultCount', args: ['count'] }],
  '@astryx.commandPalette.footer.navigate': [{ path: 'commandPalette.navigate' }],
  '@astryx.commandPalette.footer.select': [{ path: 'commandPalette.select' }],
  '@astryx.commandPalette.footer.close': [{ path: 'commandPalette.close' }],
}
