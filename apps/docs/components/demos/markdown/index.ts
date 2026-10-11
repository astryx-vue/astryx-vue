import { defineDemo } from '../../demo-infra/defineDemo'
import alignCenterDemo from './align-center.vue'
import alignCenterSource from './align-center.vue?raw&highlighted'
import alignStartDemo from './align-start.vue'
import alignStartSource from './align-start.vue?raw&highlighted'
import autolinksDemo from './autolinks.vue'
import autolinksSource from './autolinks.vue?raw&highlighted'
import blockquoteDemo from './blockquote.vue'
import blockquoteSource from './blockquote.vue?raw&highlighted'
import codeBlockDemo from './code-block.vue'
import codeBlockSource from './code-block.vue?raw&highlighted'
import compactDemo from './compact.vue'
import compactSource from './compact.vue?raw&highlighted'
import contentWidthDemo from './content-width.vue'
import contentWidthSource from './content-width.vue?raw&highlighted'
import continuationsDemo from './continuations.vue'
import continuationsSource from './continuations.vue?raw&highlighted'
import dividerDemo from './divider.vue'
import dividerSource from './divider.vue?raw&highlighted'
import emphasisDemo from './emphasis.vue'
import emphasisSource from './emphasis.vue?raw&highlighted'
import headingsDemo from './headings.vue'
import headingsSource from './headings.vue?raw&highlighted'
import imagesDemo from './images.vue'
import imagesSource from './images.vue?raw&highlighted'
import inlineCodeDemo from './inline-code.vue'
import inlineCodeSource from './inline-code.vue?raw&highlighted'
import inlineDemo from './inline.vue'
import inlineSource from './inline.vue?raw&highlighted'
import linksDemo from './links.vue'
import linksSource from './links.vue?raw&highlighted'
import nestedListsDemo from './nested-lists.vue'
import nestedListsSource from './nested-lists.vue?raw&highlighted'
import orderedListDemo from './ordered-list.vue'
import orderedListSource from './ordered-list.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import shiftedDemo from './shifted.vue'
import shiftedSource from './shifted.vue?raw&highlighted'
import streamingDemo from './streaming.vue'
import streamingSource from './streaming.vue?raw&highlighted'
import tableApiDemo from './table-api.vue'
import tableApiSource from './table-api.vue?raw&highlighted'
import tableComparisonDemo from './table-comparison.vue'
import tableComparisonSource from './table-comparison.vue?raw&highlighted'
import tableEdgesDemo from './table-edges.vue'
import tableEdgesSource from './table-edges.vue?raw&highlighted'
import tableProseDemo from './table-prose.vue'
import tableProseSource from './table-prose.vue?raw&highlighted'
import tableReleaseDemo from './table-release.vue'
import tableReleaseSource from './table-release.vue?raw&highlighted'
import tableShort320Demo from './table-short-320.vue'
import tableShort320Source from './table-short-320.vue?raw&highlighted'
import tableShort390Demo from './table-short-390.vue'
import tableShort390Source from './table-short-390.vue?raw&highlighted'
import tableShort528Demo from './table-short-528.vue'
import tableShort528Source from './table-short-528.vue?raw&highlighted'
import tableShort1024Demo from './table-short-1024.vue'
import tableShort1024Source from './table-short-1024.vue?raw&highlighted'
import tableWideDemo from './table-wide.vue'
import tableWideSource from './table-wide.vue?raw&highlighted'
import tableDemo from './table.vue'
import tableSource from './table.vue?raw&highlighted'
import taskListDemo from './task-list.vue'
import taskListSource from './task-list.vue?raw&highlighted'
import unorderedListDemo from './unordered-list.vue'
import unorderedListSource from './unordered-list.vue?raw&highlighted'

const options = { className: 'markdown-preview' }

export const markdownOverview = defineDemo(overviewDemo, overviewSource, { className: 'markdown-overview' })
export const markdownHeadings = defineDemo(headingsDemo, headingsSource, options)
export const markdownEmphasis = defineDemo(emphasisDemo, emphasisSource, options)
export const markdownLinks = defineDemo(linksDemo, linksSource, options)
export const markdownInlineCode = defineDemo(inlineCodeDemo, inlineCodeSource, options)
export const markdownCodeBlock = defineDemo(codeBlockDemo, codeBlockSource, options)
export const markdownBlockquote = defineDemo(blockquoteDemo, blockquoteSource, options)
export const markdownUnorderedList = defineDemo(unorderedListDemo, unorderedListSource, options)
export const markdownOrderedList = defineDemo(orderedListDemo, orderedListSource, options)
export const markdownNestedLists = defineDemo(nestedListsDemo, nestedListsSource, options)
export const markdownTaskList = defineDemo(taskListDemo, taskListSource, options)
export const markdownTable = defineDemo(tableDemo, tableSource, options)
export const markdownTableShort320 = defineDemo(tableShort320Demo, tableShort320Source, options)
export const markdownTableShort390 = defineDemo(tableShort390Demo, tableShort390Source, options)
export const markdownTableShort528 = defineDemo(tableShort528Demo, tableShort528Source, options)
export const markdownTableShort1024 = defineDemo(tableShort1024Demo, tableShort1024Source, options)
export const markdownTableProse = defineDemo(tableProseDemo, tableProseSource, options)
export const markdownTableEdges = defineDemo(tableEdgesDemo, tableEdgesSource, options)
export const markdownTableApi = defineDemo(tableApiDemo, tableApiSource, options)
export const markdownTableRelease = defineDemo(tableReleaseDemo, tableReleaseSource, options)
export const markdownTableComparison = defineDemo(tableComparisonDemo, tableComparisonSource, options)
export const markdownTableWide = defineDemo(tableWideDemo, tableWideSource, options)
export const markdownDivider = defineDemo(dividerDemo, dividerSource, options)
export const markdownImages = defineDemo(imagesDemo, imagesSource, options)
export const markdownAutolinks = defineDemo(autolinksDemo, autolinksSource, options)
export const markdownInline = defineDemo(inlineDemo, inlineSource, options)
export const markdownCompact = defineDemo(compactDemo, compactSource, options)
export const markdownShifted = defineDemo(shiftedDemo, shiftedSource, options)
export const markdownContentWidth = defineDemo(contentWidthDemo, contentWidthSource, options)
export const markdownAlignStart = defineDemo(alignStartDemo, alignStartSource, options)
export const markdownAlignCenter = defineDemo(alignCenterDemo, alignCenterSource, options)
export const markdownContinuations = defineDemo(continuationsDemo, continuationsSource, options)
export const markdownStreaming = defineDemo(streamingDemo, streamingSource, options)
