
import { useHotkeys } from 'react-hotkeys-hook'
import { ChevronLeft, ChevronRight, PlayCircle, StopCircle } from 'lucide-react'

import { Button } from '../ui/Button'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import {
  EventSessionMode,
  PresentationStatuses,
} from '@/types/event-session.type'
import { cn, KeyboardShortcuts, liveHotKeyProps } from '@/utils/utils'

export function PresentationControls() {
  const {
    isHost,
    previousFrame,
    currentFrame,
    nextFrame,
    startPresentation,
    stopPresentation,
    presentationStatus,
    eventSessionMode,
  } = useEventSession()
  const dispatch = useStoreDispatch()
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )

  const handlePresentationToggle = () => {
    if (presentationStarted) {
      stopPresentation()
    } else {
      startPresentation(currentFrame?.id || null)
    }
  }

  useHotkeys(
    KeyboardShortcuts.Live.startAndStopPresentation.key,
    handlePresentationToggle,
    { ...liveHotKeyProps, enabled: isHost }
  )

  const handlePreviousButton = () => {
    if (eventSessionMode === EventSessionMode.LOBBY) {
      dispatch(updateEventSessionModeAction(EventSessionMode.PEEK))
    }

    previousFrame()
  }

  const handleNextButton = () => {
    if (eventSessionMode === EventSessionMode.LOBBY) {
      dispatch(updateEventSessionModeAction(EventSessionMode.PEEK))
    }

    nextFrame()
  }

  // Allow only host to control the presentation
  if (!isHost || isInBreakoutMeeting) return null

  const presentationStarted =
    presentationStatus === PresentationStatuses.STARTED

  return (
    <div className="relative flex justify-end items-center -mx-2">
      <Button
        isIconOnly
        size="sm"
        className="live-button"
        variant="light"
        disableRipple
        disableAnimation
        onClick={handlePreviousButton}>
        <ChevronLeft size={18} />
      </Button>
      <Button
        isIconOnly
        size="md"
        disableRipple
        disableAnimation
        className={cn('rounded-md bg-transparent hover:bg-transparent')}
        variant="light"
        onClick={handlePresentationToggle}>
        {presentationStarted ? (
          <StopCircle size={32} className="text-red-500" />
        ) : (
          <PlayCircle size={32} className="text-foreground" />
        )}
      </Button>
      <Button
        isIconOnly
        size="sm"
        className="live-button"
        variant="light"
        disableRipple
        disableAnimation
        onClick={handleNextButton}>
        <ChevronRight size={18} />
      </Button>
    </div>
  )
}
