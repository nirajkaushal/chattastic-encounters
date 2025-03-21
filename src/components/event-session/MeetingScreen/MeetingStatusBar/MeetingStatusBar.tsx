/* eslint-disable jsx-a11y/no-static-element-interactions */

import { useIsMutating } from '@tanstack/react-query'

import { MeetingStatusContainer } from './MeetingStatusContainer'
import { Timer } from '../../Timer'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { AskForHelpButton } from '@/components/frames/frame-types/Breakout/AskForHelpButton'
import { Button } from '@/components/ui/Button'
import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import { EventSessionMode } from '@/types/event-session.type'
import { getRemainingTimestamp } from '@/utils/timer.utils'

/* eslint-disable jsx-a11y/click-events-have-key-events */
export function MeetingStatusBar() {
  const { eventSessionMode, startPresentation, isHost } = useEventSession()
  const dispatch = useStoreDispatch()
  const currentFrame = useCurrentFrame()
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )
  const isBreakoutStarted = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isBreakoutActive
  )
  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data!
  )
  const breakoutFrameId = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId || null
  )
  const isBreakoutActive = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.breakout.isBreakoutActive
  )
  const breakoutType = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutType
  )
  const startBreakoutMutationLoading = useIsMutating({
    exact: true,
    mutationKey: ['START_BREAKOUT'],
    status: 'pending',
  })

  const { handleBreakoutEndWithTimerDialog } = useBreakoutManagerContext()

  const timerActive =
    session?.data?.timerStartedStamp &&
    session.data.timerDuration &&
    getRemainingTimestamp(
      session.data.timerStartedStamp,
      session.data.timerDuration
    ) > 0

  const handleBreakoutEnd = () => {
    handleBreakoutEndWithTimerDialog()
  }

  if (timerActive) {
    return (
      <Timer
        showEndBreakout={
          isHost &&
          isBreakoutActive &&
          currentFrame?.id !== breakoutFrameId &&
          !isInBreakoutMeeting
        }
        onEndBreakout={handleBreakoutEnd}
      />
    )
  }
  if (isInBreakoutMeeting) {
    return (
      <MeetingStatusContainer
        description="You are in a breakout session"
        styles={{
          description: 'text-sm font-medium',
        }}
        actions={[
          <RenderIf isTrue={!isHost}>
            <AskForHelpButton />
          </RenderIf>,
        ]}
      />
    )
  }
  if (isHost && isBreakoutStarted && !startBreakoutMutationLoading) {
    return (
      <MeetingStatusContainer
        description={
          breakoutType === 'planned'
            ? 'Your planned breakout session is in progress'
            : 'Your breakout session is in progress'
        }
        styles={{
          description: 'text-sm font-medium',
        }}
        actions={[
          <RenderIf isTrue={isBreakoutActive}>
            <Button
              className="bg-red-500 text-white"
              onPress={handleBreakoutEnd}>
              End Breakout
            </Button>
          </RenderIf>,
        ]}
      />
    )
  }

  if (eventSessionMode === EventSessionMode.PEEK) {
    return (
      <MeetingStatusContainer
        description="Frames are not being shared with participants"
        styles={{
          description: 'text-sm font-medium',
        }}
        actions={[
          <RenderIf isTrue={!!currentFrame}>
            <Button
              variant="flat"
              onClick={() => {
                if (!currentFrame) return
                startPresentation(currentFrame.id)
              }}>
              Share Frame
            </Button>
          </RenderIf>,
          <Button
            color="danger"
            onPress={() => {
              dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
            }}>
            Go to Lobby
          </Button>,
        ]}
      />
    )
  }

  return null
}
