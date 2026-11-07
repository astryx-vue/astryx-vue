// 实验包入口。每个组件一个子目录，样式在 styles/ 下同名一份。

export { CircularProgress } from './CircularProgress/index.js'
export type {
  CircularProgressProps,
  CircularProgressSize,
  CircularProgressVariant,
  CircularProgressVariantMap,
} from './CircularProgress/index.js'

export { CodeEditor } from './CodeEditor/index.js'
export type { CodeEditorEmits, CodeEditorProps } from './CodeEditor/index.js'

export { createDiffFile, DiffViewer, parseUnifiedDiff } from './DiffViewer/index.js'
export type {
  CreateDiffFileOptions,
  DiffViewerChangeIndicator,
  DiffViewerEmits,
  DiffViewerFile,
  DiffViewerFileStatus,
  DiffViewerHunk,
  DiffViewerInlineHighlight,
  DiffViewerLine,
  DiffViewerLineKind,
  DiffViewerLineRef,
  DiffViewerProps,
  DiffViewerSide,
  DiffViewerSlots,
  DiffViewerViewMode,
  InlineDiffGranularity,
  InlineDiffResult,
  InlineRange,
} from './DiffViewer/index.js'

export { InfoTip } from './InfoTip/index.js'
export type { InfoTipProps, InfoTipSize } from './InfoTip/index.js'

export { ListInput } from './ListInput/index.js'
export type {
  ListInputChange,
  ListInputColumn,
  ListInputColumnWidth,
  ListInputEmits,
  ListInputProps,
  ListInputRenderContext,
  ListInputValueContext,
} from './ListInput/index.js'

export { LogStream } from './LogStream/index.js'
export type { LogEntry, LogStreamEmits, LogStreamLevel, LogStreamProps } from './LogStream/index.js'

export { MobileTokenizer } from './MobileTokenizer/index.js'
export type {
  MobileTokenizerChange,
  MobileTokenizerEmits,
  MobileTokenizerProps,
  SearchableItem,
  SearchSource,
} from './MobileTokenizer/index.js'

export { Stat } from './Stat/index.js'
export type { StatDelta, StatDeltaDirection, StatDeltaSentiment, StatProps, StatSize } from './Stat/index.js'

export {
  addCurvature,
  adjustTension,
  applyPersonality,
  bellIcon,
  calendarIcon,
  checkIcon,
  eyeIcon,
  folderIcon,
  heartIcon,
  homeIcon,
  lockIcon,
  mailIcon,
  menuIcon,
  roundCorners,
  searchIcon,
  settingsIcon,
  shieldIcon,
  starIcon,
  starterIcons,
  SVGIcon,
  xIcon,
  xifBell,
  xifBellOverride,
  xifCheck,
  xifExamples,
  xifFile,
  xifHome,
  xifShield,
  xifStar,
} from './SVGIcon/index.js'
export type {
  IconShape,
  IconShapeRole,
  PathPersonality,
  SVGIconColor,
  SVGIconDef,
  SVGIconProps,
  SVGIconSize,
  SVGIconVariation,
  XIFAnimate,
  XIFIcon,
  XIFPath,
  XIFPersonality,
  XIFSlot,
} from './SVGIcon/index.js'

export { Tour, TourStep, useTour } from './Tour/index.js'
export type {
  TourDismissSource,
  TourEmits,
  TourProps,
  TourSlots,
  TourStepProps,
  TourStepSlots,
  UseTourReturn,
} from './Tour/index.js'

export { TransferList, TransferListSelector } from './TransferList/index.js'
export type {
  PanelGroup,
  PanelRow,
  TransferListEmits,
  TransferListOption,
  TransferListProps,
  TransferListSlots,
} from './TransferList/index.js'
