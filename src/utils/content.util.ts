import { v4 as uuidv4 } from 'uuid'

import { FRAME_PICKER_FRAMES, FrameType } from './frame-picker.util'

import { BREAKOUT_TYPES } from '@/components/common/BreakoutTypePicker'
import { FrameStatus } from '@/types/enums'
import { IFrame } from '@/types/frame.type'

export const headerBlock = {
  id: uuidv4(),
  type: 'header',
  data: {
    html: '',
  },
}
export const paragraphBlock = {
  id: uuidv4(),
  type: 'paragraph',
  data: {
    html: '',
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDefaultContent = ({
  frameType,
  data,
  templateKey,
}: {
  frameType: FrameType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  templateKey?: string
}) => {
  switch (frameType) {
    case FrameType.MORAA_SLIDE:
      return {
        defaultTemplate: templateKey,
        canvas: null,
      }
    case FrameType.RICH_TEXT:
      return {
        blocks: [
          {
            id: uuidv4(),
            type: 'richtext',
            data: {},
          },
          headerBlock,
          paragraphBlock,
        ],
      }

    case FrameType.VIDEO_EMBED:
      return {
        blocks: [headerBlock, paragraphBlock],
      }

    case FrameType.POLL:
      return {
        question: '',
        options: [
          {
            name: '',
            color: '#E7E0FF',
            id: uuidv4(),
          },
          {
            name: '',
            color: '#E7E0FF',
            id: uuidv4(),
          },
          {
            name: '',
            color: '#E7E0FF',
            id: uuidv4(),
          },
        ],
        blocks: [paragraphBlock],
      }

    case FrameType.MCQ:
      return {
        question: '',
        options: [
          {
            name: '',
            color: '#E7E0FF',
            id: uuidv4(),
          },
          {
            name: '',
            color: '#E7E0FF',
            id: uuidv4(),
          },
          {
            name: '',
            color: '#E7E0FF',
            id: uuidv4(),
          },
        ],
        blocks: [paragraphBlock],
      }

    case FrameType.WORD_CLOUD:
      return {
        question: '',

        blocks: [paragraphBlock],
      }

    case FrameType.REFLECTION:
      return {
        blocks: [paragraphBlock],
      }

    case FrameType.GOOGLE_SLIDES:
      return {
        googleSlideUrl: '',
        startPosition: 1,
      }

    case FrameType.PDF_VIEWER:
      return {
        googleSlideUrl: '', // FIXME: This should be pdfURL
        startPosition: 1,
        blocks: [headerBlock, paragraphBlock],
      }

    case FrameType.MIRO_EMBED:
      return {
        blocks: [headerBlock, paragraphBlock],
      }

    case FrameType.MORAA_BOARD:
      return {
        blocks: [headerBlock, paragraphBlock],
      }
    case FrameType.BREAKOUT:
      return {
        blocks: [headerBlock, paragraphBlock],
        title: data?.title,
        description: data?.description,
      }

    default:
      return {}
  }
}

export const getFrameConfig = ({
  frameType,
  config,
  data,
}: {
  frameType: FrameType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}) => {
  const newFrameConfig = {
    textColor: '#000',
    allowVoteOnMultipleOptions: false,
    time: 1,
    colorCode: FRAME_PICKER_FRAMES.find((frame) => frame.type === frameType)
      ?.engagementType,
    ...config,
  }

  switch (frameType) {
    case FrameType.BREAKOUT: {
      const {
        breakoutType,
        breakoutRoomsGroupsCount,
        breakoutRoomsGroupsTime,
        assignmentOption,
      } = data || {}

      const breakoutConfigKeyName =
        breakoutType === BREAKOUT_TYPES.ROOMS
          ? 'breakoutRoomsCount'
          : 'participantPerGroup'

      const breakoutPayload = {
        breakoutType,
        [breakoutConfigKeyName]: breakoutRoomsGroupsCount,
        breakoutDuration: breakoutRoomsGroupsTime,
        assignmentOption,
      }

      return {
        ...newFrameConfig,
        ...breakoutPayload,
      }
    }

    case FrameType.MORAA_BOARD: {
      const defaultBoardConfig = { allowToDraw: true }

      return { ...newFrameConfig, ...defaultBoardConfig }
    }

    case FrameType.REFLECTION: {
      const defaultReflectionConfig = { maxReflectionsPerUser: 1 }

      return { ...newFrameConfig, ...defaultReflectionConfig }
    }

    case FrameType.WORD_CLOUD: {
      const defaultWordCloudConfig = {
        maxWords: 1,
        colors: ['#FF6347', '#32CD32', '#1E90FF', '#FFD700', '#9400D3'],
      }

      return { ...newFrameConfig, ...defaultWordCloudConfig }
    }

    default:
      return newFrameConfig
  }
}

export const isFrameInteractive = (frame: IFrame) =>
  [
    FrameType.POLL,
    FrameType.REFLECTION,
    FrameType.VIDEO_EMBED,
    FrameType.PDF_VIEWER,
    FrameType.MORAA_BOARD,
  ].includes(frame.type)

export const isFrameThumbnailAvailable = (frameType: FrameType) =>
  [
    FrameType.IMAGE_VIEWER,
    FrameType.PDF_VIEWER,
    FrameType.POLL,
    FrameType.REFLECTION,
    FrameType.VIDEO_EMBED,
    FrameType.MIRO_EMBED,
    FrameType.RICH_TEXT,
  ].includes(frameType)

export const collaborativeTypes = [
  FrameType.POLL,
  FrameType.REFLECTION,
  FrameType.MORAA_BOARD,
  FrameType.BREAKOUT,
]
export const presentationTypes = [FrameType.MORAA_SLIDE, FrameType.RICH_TEXT]
export const goodiesTypes = [
  FrameType.GOOGLE_SLIDES,
  FrameType.PDF_VIEWER,
  FrameType.MIRO_EMBED,
  FrameType.VIDEO_EMBED,
]

export const getContentStudioRightSidebarControlKeys = (
  frame: IFrame,
  preview: boolean
) => {
  if (preview) {
    return ['frame-notes']
  }

  if ([FrameType.MORAA_SLIDE].includes(frame.type as FrameType)) {
    return ['frame-appearance', 'frame-notes', 'frame-status']
  }

  if (
    [
      FrameType.BREAKOUT,
      FrameType.POLL,
      FrameType.REFLECTION,
      FrameType.MORAA_BOARD,
      FrameType.PDF_VIEWER,
      FrameType.MCQ,
      FrameType.MIRO_EMBED,
      FrameType.VIDEO_EMBED,
    ].includes(frame.type as FrameType)
  ) {
    return ['frame-settings', 'frame-notes', 'frame-status']
  }

  return ['frame-notes', 'frame-status']
}

export const getBlankFrame = (name: string) => ({
  id: uuidv4(),
  name,
  config: {
    time: 1,
  },
  status: FrameStatus.DRAFT,
})
