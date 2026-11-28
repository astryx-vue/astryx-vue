import type { DemoModule } from './types'
import {
  labAudioPlayer,
  labChatEmojiPicker,
  labChatReactionBar,
  labCircleCheckIndicator,
  labCircularProgress,
  labCodeEditor,
  labCommentComposer,
  labCommentPin,
  labComments,
  labCommentThread,
  labDialogHeroHeader,
  labDiffViewerOverview,
  labEmojiPicker,
  labInfoTip,
  labLineClamp,
  labListInput,
  labLogStreamOverview,
  labMediaPlayer,
  labNavigationStack,
  labPageControl,
  labRefreshControl,
  labSelectableCardGroup,
  labStat,
  labSvgIcon,
  labTabBar,
  labTourOverview,
  labTransferListOverview,
  labVideoPlayer,
} from '../lab-demos'

export interface LabCatalogEntry {
  slug: string
  name: string
  demo: DemoModule
}

/** 主站 overview 的 Lab 卡片。正文和安装说明仍由 /lab/ 页面维护。 */
export const LAB_COMPONENTS: readonly LabCatalogEntry[] = [
  { slug: 'audio-player', name: 'AudioPlayer', demo: labAudioPlayer },
  { slug: 'chat-emoji-picker', name: 'ChatEmojiPicker', demo: labChatEmojiPicker },
  { slug: 'chat-reaction-bar', name: 'ChatReactionBar', demo: labChatReactionBar },
  { slug: 'circular-progress', name: 'CircularProgress', demo: labCircularProgress },
  { slug: 'code-editor', name: 'CodeEditor', demo: labCodeEditor },
  { slug: 'comment-composer', name: 'CommentComposer', demo: labCommentComposer },
  { slug: 'comment-thread', name: 'CommentThread', demo: labCommentThread },
  { slug: 'comments', name: 'Comments', demo: labComments },
  { slug: 'comment-pin', name: 'CommentPin', demo: labCommentPin },
  { slug: 'circle-check-indicator', name: 'CircleCheckIndicator', demo: labCircleCheckIndicator },
  { slug: 'selectable-card-group', name: 'SelectableCardGroup', demo: labSelectableCardGroup },
  { slug: 'dialog-hero-header', name: 'DialogHeroHeader', demo: labDialogHeroHeader },
  { slug: 'diff-viewer', name: 'DiffViewer', demo: labDiffViewerOverview },
  { slug: 'emoji-picker', name: 'EmojiPicker', demo: labEmojiPicker },
  { slug: 'info-tip', name: 'InfoTip', demo: labInfoTip },
  { slug: 'line-clamp', name: 'LineClamp', demo: labLineClamp },
  { slug: 'list-input', name: 'ListInput', demo: labListInput },
  { slug: 'log-stream', name: 'LogStream', demo: labLogStreamOverview },
  { slug: 'media-player', name: 'MediaPlayer', demo: labMediaPlayer },
  { slug: 'navigation-stack', name: 'NavigationStack', demo: labNavigationStack },
  { slug: 'page-control', name: 'PageControl', demo: labPageControl },
  { slug: 'refresh-control', name: 'useRefreshControl', demo: labRefreshControl },
  { slug: 'stat', name: 'Stat', demo: labStat },
  { slug: 'svg-icon', name: 'SVGIcon', demo: labSvgIcon },
  { slug: 'tab-bar', name: 'TabBar', demo: labTabBar },
  { slug: 'tour', name: 'Tour', demo: labTourOverview },
  { slug: 'transfer-list', name: 'TransferList', demo: labTransferListOverview },
  { slug: 'video-player', name: 'VideoPlayer', demo: labVideoPlayer },
]
