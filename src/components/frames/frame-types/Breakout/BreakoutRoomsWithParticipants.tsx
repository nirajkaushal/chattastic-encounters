/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useState } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { DyteConnectedMeetings } from '@dytesdk/web-core'
import { Button } from '@heroui/react'
import { DragDropContext } from 'react-beautiful-dnd'

// eslint-disable-next-line import/no-cycle
import { BreakoutRoomActivityCard } from './BreakoutActivityCard'
import { BREAKOUT_TYPES } from '../../../common/BreakoutTypePicker'
import { RenderIf } from '../../../common/RenderIf/RenderIf'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutActivities } from '@/hooks/useBreakoutActivities'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreSelector } from '@/hooks/useRedux'

export function BreakoutRoomsWithParticipants({
  hideActivityCards,
}: {
  hideActivityCards?: boolean
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCount] = useState(0)
  const { getFrameById } = useEventContext()
  const { isHost } = useEventSession()
  const meeting = useDyteSelector((meet) => meet)
  const mainMeetingId = meeting.meta.meetingId
  const connectedMeetings = meeting.connectedMeetings?.meetings || []
  const mainMeetingParticipants =
    meeting.connectedMeetings?.parentMeeting?.participants || []
  const { breakoutRoomsInstance } = useBreakoutManagerContext()
  const { isBreakoutActive } = useBreakoutRooms()
  const breakoutFrameId = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId
  )
  const connectedMeetingsToActivitiesMap = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.connectedMeetingsToActivitiesMap
  )
  const meetingTitles = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.meetingTitles
  )

  useEffect(() => {
    if (!isBreakoutActive) return () => null

    const interval = setInterval(() => setCount((count) => count + 1), 2000)

    return () => clearInterval(interval)
  }, [isBreakoutActive])

  const joinRoom = (meetId: string) => {
    breakoutRoomsInstance?.joinRoom(meetId)
  }

  const breakoutFrame = getFrameById(breakoutFrameId!)

  const breakoutActivityQuery = useBreakoutActivities({
    frameId: breakoutFrameId!,
  })

  const meetingsAndActivityList = Object.entries(
    connectedMeetingsToActivitiesMap || {}
  )

  if (!breakoutActivityQuery.isSuccess) return null

  const sortedConnectedMeetings =
    breakoutFrame.config.breakoutType === BREAKOUT_TYPES.GROUPS
      ? connectedMeetings.sort((a, b) => a.id!.localeCompare(b.id!))
      : breakoutActivityQuery.data
          .map(
            (room) =>
              connectedMeetings.find((meet) =>
                meetingsAndActivityList.find(
                  ([meetId, activityId]) =>
                    room?.activity_frame_id === activityId && meet.id === meetId
                )
              ) as DyteConnectedMeetings['meetings'][number]
          )
          .filter(Boolean)

  return (
    <div className="w-full flex-1">
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(262px,_1fr))] gap-3 overflow-y-auto">
        <DragDropContext
          onDragEnd={(result) => {
            const participantId = result.draggableId.split('_')[1] as string
            const destinationRoomId = result.destination?.droppableId.split(
              '_'
            )[1] as string
            const allMeetings = [
              ...meeting.connectedMeetings.meetings,
              meeting.connectedMeetings.parentMeeting,
            ]

            const sourceMeeting = allMeetings.find((meet) =>
              meet.participants.some(
                (participant) =>
                  participant.customParticipantId === participantId
              )
            )
            if (sourceMeeting?.id === destinationRoomId) return

            breakoutRoomsInstance?.moveParticipantToAnotherRoom(
              participantId,
              destinationRoomId
            )
          }}>
          <BreakoutRoomActivityCard
            editable={false}
            breakout={{
              id: '',
              name: 'Main Room',
              activity_frame_id: '',
            }}
            roomId={mainMeetingId}
            hideActivityCard
            participants={mainMeetingParticipants}
          />
          {sortedConnectedMeetings.map((meet) => (
            <BreakoutRoomActivityCard
              key={meet.id}
              breakout={{
                id: '',
                activity_frame_id: connectedMeetingsToActivitiesMap?.[
                  meet.id as string
                ] as string,
                name: meetingTitles?.find((m) => m.id === meet.id)
                  ?.title as string,
              }}
              editable={false}
              roomId={meet.id}
              hideActivityCard={hideActivityCards}
              participants={meet.participants?.map((p) => ({
                displayName: p?.displayName || '',
                customParticipantId: p?.customParticipantId || '',
                displayPictureUrl: p?.displayPictureUrl || '',
              }))}
              JoinRoomButton={
                <RenderIf
                  isTrue={
                    meet.id !== mainMeetingId &&
                    (isHost ||
                      breakoutFrame.config.assignmentOption === 'choose')
                  }>
                  <Button
                    className="m-2 border-1"
                    size="sm"
                    variant="ghost"
                    onClick={() => joinRoom(meet.id || '')}>
                    Join
                  </Button>
                </RenderIf>
              }
            />
          ))}
        </DragDropContext>
      </div>
    </div>
  )
}
