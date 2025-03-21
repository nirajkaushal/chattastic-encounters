/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import {
  AssignmentOption,
  AssignmentOptionSelector,
} from './AssignmentOptionSelector'
import { AssignParticipantsModal } from './AssignParticipantsModal/AssignParticipantsModal'
import { BREAKOUT_TYPES } from '../../../common/BreakoutTypePicker'
import { NumberInput } from '../../../common/NumberInput'

import { Button } from '@/components/ui/Button'
import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutActivities } from '@/hooks/useBreakoutActivities'
import { useDyteParticipants } from '@/hooks/useDyteParticipants'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { SessionService } from '@/services/session.service'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { PresentationStatuses } from '@/types/event-session.type'
import { StartBreakoutConfig } from '@/utils/dyte-breakout'
import { shuffleAndGroup } from '@/utils/shuffle-array'
import { getCurrentTimestamp } from '@/utils/timer.utils'

type StartPlannedBreakoutModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function StartPlannedBreakoutModal({
  open,
  setOpen,
}: StartPlannedBreakoutModalProps) {
  const { joinedParticipants } = useDyteParticipants()
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false)
  const { updateFrame } = useEventContext()
  const { eventRealtimeChannel, currentFrame, presentationStatus } =
    useEventSession()
  const dyteMeeting = useDyteMeeting()
  const currentParticipantCount = joinedParticipants.length
  const breakoutActivityQuery = useBreakoutActivities({
    frameId: currentFrame!.id!,
  })
  const roomsCount = breakoutActivityQuery.data?.length
  const participantPerGroup = currentFrame?.config?.participantPerGroup
  const breakoutDuration = currentFrame?.config.breakoutDuration
  const assignmentOption = currentFrame?.config
    .assignmentOption as AssignmentOption
  const [breakoutConfig, setBreakoutConfig] = useState({
    participantPerGroup:
      participantPerGroup ||
      Math.ceil(currentParticipantCount / (roomsCount || 2)),
    roomsCount:
      roomsCount ||
      (participantPerGroup
        ? Math.floor(currentParticipantCount / participantPerGroup)
        : 2),
    breakoutDuration: breakoutDuration || 5,
    assignmentOption: assignmentOption || 'auto',
  })
  const { breakoutRoomsInstance, handleBreakoutEndWithTimerDialog } =
    useBreakoutManagerContext()
  const meetingId = useStoreSelector(
    (store) => store.event.currentEvent.meetingState.meeting.data?.id
  )
  const dispatch = useStoreDispatch()

  const startBreakoutMutation = useMutation({
    mutationKey: ['START_BREAKOUT'],
    mutationFn: async (
      config: {
        breakoutFrameId?: string
        breakoutDuration?: number
        activities?: Array<{ activityId?: string; name: string }>
        activityId?: string
      } & StartBreakoutConfig
    ) => {
      if (!meetingId) return

      await breakoutRoomsInstance?.startBreakoutRooms({
        roomsCount: isRoomsBreakout ? config.roomsCount : undefined,
        participantPerGroup: isGroupsBreakout
          ? config.participantPerGroup
          : undefined,
        assignmentOption: config.assignmentOption || 'auto',
      })
      const { meetings } =
        await dyteMeeting.meeting.connectedMeetings.getConnectedMeetings()

      const connectedMeetingsToActivitiesMap: { [x: string]: string } =
        meetings.reduce(
          (acc, meet, idx) => ({
            ...acc,
            [meet.id as string]:
              config?.activities?.[idx]?.activityId ||
              config.activityId ||
              null,
          }),
          {}
        )
      const meetingTitles = Object.entries(
        connectedMeetingsToActivitiesMap
      ).map(([meetId, activityId], index) => ({
        id: meetId,
        title: config.activities
          ? `${config.activities.find((activity) => activity.activityId === activityId)?.name}`
          : `Breakout group ${index + 1}`,
      }))

      const currentTimeStamp = getCurrentTimestamp()
      const timerDuration = config.breakoutDuration
        ? config.breakoutDuration * 60
        : null
      dispatch(
        updateMeetingSessionDataAction({
          breakoutFrameId:
            presentationStatus === PresentationStatuses.STARTED
              ? config.breakoutFrameId
              : null,
          connectedMeetingsToActivitiesMap,
          timerStartedStamp: currentTimeStamp,
          timerDuration,
          meetingTitles,
          breakoutType: 'planned',
        })
      )

      SessionService.createSessionForBreakouts({
        dyteMeetings: meetings.map((meet) => ({
          connected_dyte_meeting_id: meet.id!,
          data: {
            currentFrameId: connectedMeetingsToActivitiesMap[meet.id!],
            presentationStatus,
            timerStartedStamp: currentTimeStamp,
            timerDuration,
            meetingTitles,
            framesConfig: {
              [connectedMeetingsToActivitiesMap[meet.id!]]: {
                reflectionStarted: true,
              },
            },
          },
          meeting_id: meetingId,
        })),
      })
    },
    onError: (error) => {
      breakoutRoomsInstance?.endBreakoutRooms()
      toast.error('Failed to start breakout, Please try again...')
      console.log('🚀 ~ onBreakoutStartOnBreakoutSlide ~ err:', error)
    },
  })

  const breakoutType = currentFrame?.config.breakoutType
  const isGroupsBreakout = breakoutType === BREAKOUT_TYPES.GROUPS
  const isRoomsBreakout = breakoutType === BREAKOUT_TYPES.ROOMS

  useEffect(() => {
    setBreakoutConfig({
      participantPerGroup:
        participantPerGroup ||
        Math.ceil(currentParticipantCount / (roomsCount || 2)),
      roomsCount:
        roomsCount ||
        (participantPerGroup
          ? Math.floor(currentParticipantCount / participantPerGroup)
          : 2),
      breakoutDuration: breakoutDuration || 5,
      assignmentOption: assignmentOption || 'auto',
    })
  }, [
    breakoutDuration,
    currentParticipantCount,
    participantPerGroup,
    roomsCount,
    assignmentOption,
  ])

  const isConfigAlreadyProvided =
    typeof roomsCount !== 'undefined' ||
    typeof participantPerGroup !== 'undefined'

  const RoomSizeConfig = (() => {
    // Calculate the distribution based on the groups array
    const groups = shuffleAndGroup(
      joinedParticipants.map((p) => p.id),
      isRoomsBreakout
        ? Math.ceil(joinedParticipants.length / breakoutConfig.roomsCount!) || 1
        : breakoutConfig.participantPerGroup
    )

    const groupSizes = groups.map((group) => group.length) // Get the size of each group
    const sizeCountMap = new Map<number, number>() // Map to store how many groups have a specific size

    // Populate the sizeCountMap
    groupSizes.forEach((size) => {
      if (sizeCountMap.has(size)) {
        sizeCountMap.set(size, sizeCountMap.get(size)! + 1)
      } else {
        sizeCountMap.set(size, 1)
      }
    })

    // Generate the distribution statement
    const distributionStatement = Array.from(sizeCountMap.entries()).map(
      ([size, count]) => (
        <p>
          {count} room{count > 1 ? 's' : ''} * {size} participant
          {size > 1 ? 's' : ''}
        </p>
      )
    )

    return <p className="pl-4">{distributionStatement}</p>
  })()

  const DurationUI = (
    <div className="grid grid-cols-[50%_50%] gap-2">
      <p className="flex items-center">Duration (mins):</p>
      <div className="flex justify-end items-center">
        <NumberInput
          min={1}
          max={30}
          allowNegative={false}
          number={breakoutConfig.breakoutDuration}
          onNumberChange={(setNumber) =>
            setBreakoutConfig((conf) => ({
              ...conf,
              breakoutDuration: setNumber,
            }))
          }
        />
      </div>
    </div>
  )

  const AssignmentOptionUI = (
    <AssignmentOptionSelector
      label="How participants can join"
      layout="columns"
      assignmentOption={breakoutConfig.assignmentOption}
      disabled={currentFrame?.config.breakoutType === BREAKOUT_TYPES.GROUPS}
      onChange={(value) => {
        if (!currentFrame) return

        // Update the frame with the new breakout join method
        updateFrame({
          framePayload: {
            config: {
              ...currentFrame.config,
              assignmentOption: value,
            },
          },
          frameId: currentFrame.id,
        })

        // Update the local state
        setBreakoutConfig((conf) => ({
          ...conf,
          assignmentOption: value,
        }))
      }}
    />
  )

  const ShowConfigurationsUI = {
    rooms: (
      <div className="grid grid-cols-[50%_50%] gap-2">
        <div>
          <p className="flex items-center">Number of rooms:</p>{' '}
          <p className="text-xs text-gray-500">{RoomSizeConfig}</p>
        </div>
        <div className="flex justify-end px-11 items-center">
          {breakoutConfig.roomsCount}
        </div>
      </div>
    ),
    participants_per_room: (
      <div className="grid grid-cols-[50%_50%] gap-2">
        <div>
          <p className="flex items-center">Participants per room:</p>
          <p className="text-xs text-gray-500">{RoomSizeConfig}</p>
        </div>
        <div className="flex justify-end items-center">
          <NumberInput
            min={1}
            max={30}
            allowNegative={false}
            number={participantPerGroup}
            onNumberChange={(setNumber) =>
              setBreakoutConfig((conf) => ({
                ...conf,
                participantPerGroup: setNumber,
                roomsCount: Math.floor(currentParticipantCount / setNumber),
              }))
            }
          />
        </div>
      </div>
    ),
  }

  const ConfigureRoomsUI = (
    <div className="grid grid-cols-[50%_50%] gap-2">
      <div>
        <p className="flex items-center">Number of rooms:</p>{' '}
        <p className="text-xs text-gray-500">{RoomSizeConfig}</p>
      </div>
      <div className="flex justify-center items-center">
        <NumberInput
          min={1}
          max={currentParticipantCount}
          allowNegative={false}
          number={breakoutConfig.roomsCount}
          onNumberChange={(setNumber) =>
            setBreakoutConfig((conf) => ({
              ...conf,
              roomsCount: setNumber,
            }))
          }
        />
      </div>
    </div>
  )

  const isParticipantJoined = (participantId: string) =>
    joinedParticipants.some((p) => p.customParticipantId === participantId)

  const startBreakout = () => {
    if (!eventRealtimeChannel) {
      setOpen(false)
      startBreakoutMutation.mutate({
        ...breakoutConfig,
        activities: isRoomsBreakout
          ? breakoutActivityQuery.data?.map((activity) => ({
              name: activity.name as string,
              activityId: activity.activity_frame_id!,
            }))
          : undefined,
        activityId: isGroupsBreakout
          ? breakoutActivityQuery.data?.[0].activity_frame_id || undefined
          : undefined,
        breakoutFrameId: currentFrame?.id,
      })

      return
    }
    setOpen(false)

    handleBreakoutEndWithTimerDialog({
      onBreakoutEndTriggered() {
        startBreakoutMutation.mutate({
          ...breakoutConfig,
          activities: isRoomsBreakout
            ? breakoutActivityQuery.data?.map((activity) => ({
                name: activity.name as string,
                activityId: activity.activity_frame_id!,
              }))
            : undefined,
          activityId: isGroupsBreakout
            ? breakoutActivityQuery.data?.[0].activity_frame_id || undefined
            : undefined,
          breakoutFrameId: currentFrame?.id,
        })
      },
    })
  }

  const moveParticipantsToMainRoom = async (
    newBreakoutRoomAssignments: Record<string, string[]>
  ) => {
    updateFrame({
      framePayload: {
        content: {
          ...currentFrame?.content,
          breakoutRoomAssignments: newBreakoutRoomAssignments,
        },
      },
      frameId: currentFrame?.id as string,
    })
  }

  const applyAssigParticipantsConfig = async () => {
    const breakoutRoomAssignments = (currentFrame?.content
      ?.breakoutRoomAssignments || {}) as Record<string, string[]>
    const meetings = Array.from(dyteMeeting.meeting.connectedMeetings.meetings)
    const newBreakoutRoomAssignments: Record<string, string[]> = JSON.parse(
      JSON.stringify(breakoutRoomAssignments)
    )

    if (!breakoutRoomAssignments) return

    Object.keys(breakoutRoomAssignments).forEach((roomId, index) => {
      const participants = breakoutRoomAssignments[roomId] || []
      const meetingToJoin = meetings[index]

      if (!meetingToJoin?.id) return

      if (participants.length === 0) return

      participants.forEach((participantId: string) => {
        if (!participantId) return

        if (!isParticipantJoined(participantId)) {
          newBreakoutRoomAssignments[roomId] = newBreakoutRoomAssignments[
            roomId
          ].filter((id) => id !== participantId)

          return
        }

        breakoutRoomsInstance?.moveParticipantToAnotherRoom(
          participantId,
          meetingToJoin.id!
        )
      })
    })

    await moveParticipantsToMainRoom(newBreakoutRoomAssignments)

    toast.success('Participants assigned successfully')
  }

  return (
    <>
      <Modal size="lg" isOpen={open} onOpenChange={setOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Start Breakout
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-6">
                  {isConfigAlreadyProvided
                    ? ShowConfigurationsUI[
                        participantPerGroup ? 'participants_per_room' : 'rooms'
                      ]
                    : ConfigureRoomsUI}
                  {DurationUI}
                  {AssignmentOptionUI}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  size="sm"
                  onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  onPress={() => {
                    if (assignmentOption === 'manual') {
                      setOpenAssignmentModal(true)

                      return
                    }

                    startBreakout()
                  }}>
                  Start
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <AssignParticipantsModal
        open={openAssignmentModal}
        actions={
          <div className="flex justify-between items-center w-full">
            <p className="text-gray-600 text-xs">
              Inactive participants will be moved to the main room if they are
              assigned to any breakout room.
            </p>
            <div className="flex justify-end items-center gap-2">
              <Button
                color="danger"
                size="sm"
                onPress={() => {
                  startBreakout()
                  setOpenAssignmentModal(false)
                }}>
                Skip
              </Button>
              <Button
                color="primary"
                size="sm"
                onPress={() => {
                  startBreakout()
                  setTimeout(() => {
                    applyAssigParticipantsConfig()
                  }, 6000)
                  setOpenAssignmentModal(false)
                }}>
                Use this configuration
              </Button>
            </div>
          </div>
        }
        setOpen={setOpenAssignmentModal}
      />
    </>
  )
}
