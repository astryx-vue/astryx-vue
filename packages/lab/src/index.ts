// 实验包入口。每个组件一个子目录，样式在 styles/ 下同名一份。

export { ChatEmojiPicker, ChatReactionBar, DEFAULT_CHAT_EMOJIS } from './Chat/index.js'
export type {
  ChatEmojiOption,
  ChatEmojiPickerEmits,
  ChatEmojiPickerProps,
  ChatEmojiPickerSlots,
  ChatReaction,
  ChatReactionBarEmits,
  ChatReactionBarProps,
} from './Chat/index.js'

export { CircleCheckIndicator } from './CircleCheckIndicator/index.js'
export type { CircleCheckIndicatorProps } from './CircleCheckIndicator/index.js'

export { CircularProgress } from './CircularProgress/index.js'
export type {
  CircularProgressProps,
  CircularProgressSize,
  CircularProgressVariant,
  CircularProgressVariantMap,
} from './CircularProgress/index.js'

export { CodeEditor } from './CodeEditor/index.js'
export type { CodeEditorEmits, CodeEditorProps } from './CodeEditor/index.js'

export { CommentPin } from './CommentPin/index.js'
export type {
  CommentPinEmits,
  CommentPinParticipant,
  CommentPinProps,
  CommentPinSize,
} from './CommentPin/index.js'

export {
  COMMENT_ICON_KEYS,
  CommentComposer,
  CommentComposerBase,
  Comments,
  CommentThread,
  DEFAULT_COMMENT_REACTIONS,
} from './Comments/index.js'
export type {
  CommentActivityEvent,
  CommentAgentCommand,
  CommentAnchor,
  CommentComposerBaseEmits,
  CommentComposerBaseProps,
  CommentComposerBaseSlots,
  CommentComposerContext,
  CommentComposerEmits,
  CommentComposerProps,
  CommentComposerRenderProps,
  CommentComposerSlots,
  CommentData,
  CommentHighlightColor,
  CommentImageUploader,
  CommentMode,
  CommentProgress,
  CommentReaction,
  CommentReactionOption,
  CommentsComposerPosition,
  CommentsDensity,
  CommentsEmits,
  CommentsLayout,
  CommentsProps,
  CommentsSlots,
  CommentStatus,
  CommentThreadData,
  CommentThreadEmits,
  CommentThreadProps,
  CommentThreadSharedProps,
  CommentThreadSlots,
  CommentUploadedImage,
  CommentUser,
  CommentVersion,
} from './Comments/index.js'

export { DialogHeroHeader } from './DialogHeroHeader/index.js'
export type { DialogHeroHeaderMediaMode, DialogHeroHeaderProps, DialogHeroHeaderSlots } from './DialogHeroHeader/index.js'

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

export { DEFAULT_FREQUENT_EMOJIS, EmojiPicker } from './EmojiPicker/index.js'
export type {
  EmojiCategory,
  EmojiOption,
  EmojiPickerEmits,
  EmojiPickerProps,
} from './EmojiPicker/index.js'

export { InfoTip } from './InfoTip/index.js'
export type { InfoTipProps, InfoTipSize } from './InfoTip/index.js'

export { LineClamp } from './LineClamp/index.js'
export type { LineClampAs, LineClampProps, LineClampSlots, LineClampTooltipPlacement } from './LineClamp/index.js'

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

export {
  AudioPlayer,
  DEFAULT_PLAYBACK_RATES,
  formatClock,
  formatSpokenTime,
  MARKER_CONTENT_ATTRIBUTE,
  MEDIA_ICON_KEYS,
  MediaCaptionsButton,
  MediaFullscreenButton,
  MediaPlaybackRate,
  MediaPlayButton,
  MediaPlayer,
  MediaPlayerElement,
  mediaPlayerMessages,
  MediaSeekButton,
  MediaTime,
  MediaTimeSlider,
  MediaVolume,
  useMediaPlaybackTime,
  useMediaPlayer,
  VideoPlayer,
} from './MediaPlayer/index.js'
export type {
  AudioPlayerProps,
  AudioPlayerSlots,
  MediaButtonPartProps,
  MediaControlsHold,
  MediaControlSize,
  MediaIconName,
  MediaPlaybackRateProps,
  MediaPlayButtonProps,
  MediaPlayerActions,
  MediaPlayerElementProps,
  MediaPlayerElementSlots,
  MediaPlayerEmits,
  MediaPlayerError,
  MediaPlayerMessages,
  MediaPlayerProps,
  MediaPlayerSlots,
  MediaPlayerState,
  MediaSeekButtonProps,
  MediaSliderPlacement,
  MediaTextTrackInfo,
  MediaTimeDisplay,
  MediaTimelineChapter,
  MediaTimelineMarker,
  MediaTimeProps,
  MediaTimeSliderProps,
  MediaVolumeProps,
  UseMediaPlayerReturn,
  VideoPlayerCaptionTrack,
  VideoPlayerProps,
} from './MediaPlayer/index.js'

export { NavigationScreen, NavigationStack, useNavigationStack } from './NavigationStack/index.js'
export type {
  NavigationScreenProps,
  NavigationScreenSlots,
  NavigationStackApi,
  NavigationStackProps,
  NavigationStackSlots,
  NavigationTitleDisplayMode,
} from './NavigationStack/index.js'

export { PageControl } from './PageControl/index.js'
export type { PageControlEmits, PageControlProps } from './PageControl/index.js'

export { createEventFromISO, createScheduleDayView, createScheduleListView, createScheduleMonthlyView, createScheduleWeeklyView, defaultSchedulePlugins, Schedule, ScheduleContext, useScheduleContext, useSchedulePaginationPlugin, useScheduleViewSelectorPlugin } from './Schedule/index.js'
export type {
  CalendarDayEvent,
  CalendarEvent,
  CalendarEventBase,
  CalendarInstantEvent,
  Instant,
  ScheduleCategory,
  ScheduleContextValue,
  ScheduleDate,
  ScheduleEmits,
  ScheduleEventColor,
  ScheduleEventSource,
  ScheduleHeaderContent,
  SchedulePaginationPluginOptions,
  SchedulePlugin,
  SchedulePluginPosition,
  ScheduleProps,
  ScheduleRange,
  ScheduleTimeGridViewOptions,
  ScheduleView,
  ScheduleViewBase,
  ScheduleViewOptions,
  ScheduleViewSelectorOption,
  ScheduleViewSelectorPluginOptions,
  ZonedDateTime,
  ZonedDateTimeRange,
} from './Schedule/index.js'

export { SelectableCardGroup, SelectableCardGroupItem } from './SelectableCardGroup/index.js'
export type {
  SelectableCardGroupEmits,
  SelectableCardGroupItemProps,
  SelectableCardGroupItemSlots,
  SelectableCardGroupOrientation,
  SelectableCardGroupProps,
  SelectableCardGroupSelectionMode,
  SelectableCardGroupSlots,
} from './SelectableCardGroup/index.js'

export { Stat } from './Stat/index.js'
export type { StatDelta, StatDeltaDirection, StatDeltaSentiment, StatProps, StatSize } from './Stat/index.js'

export {
  addCurvature,
  adjustTension,
  applyPersonality,
  bellIcon,
  bellWeightedIcon,
  buildWeightedIcon,
  calendarIcon,
  calendarWeightedIcon,
  checkIcon,
  checkWeightedIcon,
  eyeIcon,
  eyeWeightedIcon,
  folderIcon,
  folderWeightedIcon,
  heartIcon,
  heartWeightedIcon,
  homeIcon,
  homeWeightedIcon,
  ICON_WEIGHTS,
  lockIcon,
  lockWeightedIcon,
  mailIcon,
  mailWeightedIcon,
  menuIcon,
  menuWeightedIcon,
  parseSVGPaths,
  registerWeightProbe,
  roundCorners,
  searchIcon,
  searchWeightedIcon,
  settingsIcon,
  settingsWeightedIcon,
  shieldIcon,
  shieldWeightedIcon,
  starIcon,
  starterIcons,
  starWeightedIcon,
  SVGIcon,
  WeightedIconSprite,
  weightedIconSymbolId,
  weightedStarterIcons,
  WeightedSVGIcon,
  xIcon,
  xifBell,
  xifBellOverride,
  xifCheck,
  xifExamples,
  xifFile,
  xifHome,
  xifShield,
  xifStar,
  xWeightedIcon,
} from './SVGIcon/index.js'
export type {
  BuildWeightedIconOptions,
  IconShape,
  IconShapeRole,
  IconWeight,
  PathPersonality,
  SVGIconColor,
  SVGIconDef,
  SVGIconProps,
  SVGIconSize,
  SVGIconVariation,
  WeightedIconDef,
  WeightedIconLayer,
  WeightedIconPath,
  XIFAnimate,
  XIFIcon,
  XIFPath,
  XIFPersonality,
  XIFSlot,
} from './SVGIcon/index.js'

export { TabBar, TabBarItem } from './TabBar/index.js'
export type { TabBarEmits, TabBarIcon, TabBarItemProps, TabBarProps, TabBarSlots } from './TabBar/index.js'

export { TabBarMoreList } from './TabBarMoreList/index.js'
export type { TabBarMoreListEmits, TabBarMoreListProps, TabBarMoreListSlots } from './TabBarMoreList/index.js'

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
