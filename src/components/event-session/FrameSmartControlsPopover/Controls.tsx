import { BreakoutControls } from './BreakoutControls'
import { MCQControls } from './MCQControls'
import { PollControls } from './PollControls'
import { ReflectionControls } from './ReflectionControls'
import { WordCloudControls } from './WordCloudControls'

import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { FrameType } from '@/utils/frame-picker.util'

export const getControls = (frameType: FrameType) => {
  if (!frameType) return null

  const renderersByFrameType: Record<FrameType, React.ReactNode> = {
    [FrameType.BREAKOUT]: <BreakoutControls />,
    [FrameType.GOOGLE_SLIDES]: null,
    [FrameType.IMAGE_VIEWER]: null,
    [FrameType.MIRO_EMBED]: null,
    [FrameType.MORAA_BOARD]: null,
    [FrameType.MORAA_PAD]: null,
    [FrameType.MORAA_SLIDE]: null,
    [FrameType.PDF_VIEWER]: null,
    [FrameType.POLL]: <PollControls />,
    [FrameType.POWERPOINT]: null,
    [FrameType.Q_A]: null,
    [FrameType.REFLECTION]: <ReflectionControls />,
    [FrameType.RICH_TEXT]: null,
    [FrameType.VIDEO_EMBED]: null,
    [FrameType.MCQ]: <MCQControls />,
    [FrameType.WORD_CLOUD]: <WordCloudControls />,
    [FrameType.EMBED_LINK]: null,
  }

  const renderer = renderersByFrameType[frameType]

  return renderer
}

export function Controls() {
  const currentFrame = useCurrentFrame()

  if (!currentFrame) return <div />

  const controls = getControls(currentFrame.type as FrameType)

  return controls
}
