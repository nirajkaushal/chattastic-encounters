
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useRef } from 'react'

import { Avatar } from '@heroui/react'
import { Draggable } from 'react-beautiful-dnd'
import { Apps, CircleSquareTriangle, MoreVertical, Trash2 } from 'lucide-react'

// TODO: Fix this.
// eslint-disable-next-line import/no-cycle
import { BreakoutFrameThumbnailCard } from './BreakoutFrameThumbnailCard'

import { DropdownActions } from '@/components/common/DropdownActions'
import { EditableLabel } from '@/components/common/EditableLabel'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Tooltip } from '@/components/common/ShortuctTooltip'
import { StrictModeDroppable } from '@/components/common/StrictModeDroppable'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useDimensions } from '@/hooks/useDimensions'
import { BreakoutActivityModel } from '@/types/models'
import { cn } from '@/utils/utils'

type BreakoutRoomActivityCardProps = {
  breakout: Pick<BreakoutActivityModel, 'activity_frame_id' | 'id' | 'name'>
  hideActivityCard?: boolean
  participants?: {
    id?: string
    displayName?: string
    displayPictureUrl?: string
    customParticipantId?: string
  }[]
  editable: boolean
  deleteActivityFrame?: (roomId: string) => void
  updateBreakoutRoomName?: (value: string, roomId: string) => void
  deleteRoomGroup?: (roomId: string) => void
  onAddNewActivity?: (roomId: string) => void
  hideRoomDelete?: boolean
  JoinRoomButton?: React.ReactElement
  roomId?: string
}

export const roomActions = [
  {
    key: 'delete-room',
    label: 'Delete room',
    icon: <Trash2 className="text-slate-500" size={20} />,
  },
  {
    key: 'add-activity',
    label: 'Add activity in room',
    icon: <Apps className="text-slate-500" size={20} />,
  },
  {
    key: 'delete-room-activity',
    label: 'Remove activity from room',
    icon: <Trash2 className="text-slate-500" size={20} />,
  },
]

export function BreakoutRoomActivityCard({
  breakout,
  editable,
  hideActivityCard = false,
  updateBreakoutRoomName,
  deleteRoomGroup,
  deleteActivityFrame,
  onAddNewActivity,
  hideRoomDelete,
  participants,
  JoinRoomButton,
  roomId,
}: BreakoutRoomActivityCardProps) {
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    'maximized'
  )
  const { setCurrentFrame, getFrameById, isOwner } = useEventContext()

  const getActions = () => {
    const actions = []

    if (!hideRoomDelete) {
      actions.push(roomActions[0])
    }

    if (breakout?.activity_frame_id) {
      actions.push(roomActions[2])
    }
    if (!breakout?.activity_frame_id) {
      actions.push(roomActions[1])
    }

    return actions
  }

  return (
    <div className="border rounded-xl bg-white relative" key={breakout?.name}>
      <div className="flex justify-between items-center gap-4 px-3">
        <EditableLabel
          readOnly={!editable || !updateBreakoutRoomName}
          label={breakout?.name || ''}
          className="text-sm line-clamp-1 my-2"
          onUpdate={(value) => {
            if (!editable) return
            // if (frame.content.breakout === value) return

            updateBreakoutRoomName?.(value, breakout.id)
          }}
        />
        <RenderIf isTrue={editable}>
          <DropdownActions
            triggerIcon={
              <Button isIconOnly variant="light" className="-mr-2.5">
                <MoreVertical size={20} />
              </Button>
            }
            actions={getActions()}
            onAction={(actionKey) => {
              if (actionKey === 'delete-room') {
                deleteRoomGroup?.(breakout.id)
              }

              if (actionKey === 'delete-room-activity') {
                deleteActivityFrame?.(breakout.id)
              }

              if (actionKey === 'add-activity') {
                onAddNewActivity?.(breakout.id)
              }
            }}
          />
        </RenderIf>
      </div>
      <RenderIf isTrue={!hideActivityCard}>
        <div
          className={cn(
            'border border-gray-100 text-gray-400 m-1 bg-[#f9f6ff] rounded-xl aspect-video'
          )}>
          <RenderIf
            isTrue={
              !!breakout?.activity_frame_id &&
              !!getFrameById(breakout?.activity_frame_id)
            }>
            <div
              ref={thumbnailContainerRef}
              className="relative w-full h-full cursor-pointer"
              onClick={() => {
                if (!editable) return
                setCurrentFrame(getFrameById(breakout!.activity_frame_id!))
              }}>
              <BreakoutFrameThumbnailCard
                frame={getFrameById(breakout?.activity_frame_id as string)}
                containerWidth={containerWidth}
                inViewPort
              />
            </div>
          </RenderIf>
          <RenderIf isTrue={!breakout?.activity_frame_id}>
            <div
              className="grid place-items-center h-full w-full cursor-pointer aspect-video"
              onClick={() => {
                if (!editable) return
                onAddNewActivity?.(breakout.id)
              }}>
              <div
                className={cn('grid place-items-center gap-4', {
                  'gap-2': !editable,
                })}>
                <CircleSquareTriangle
                  size={48}
                  className={cn({
                    'text-primary-300': editable,
                    'text-gray-300': !editable,
                  })}
                />

                <p className="text-xs text-center">
                  {editable ? (
                    <>
                      Click to select a collaborative
                      <br />
                      activity!
                    </>
                  ) : (
                    'No activity!'
                  )}
                </p>
              </div>
            </div>
          </RenderIf>
        </div>
      </RenderIf>
      {!!participants && (
        <StrictModeDroppable
          droppableId={`participant-droppable_${roomId}`}
          direction="horizontal"
          type="participant">
          {(participantDroppableProvided, snapshot) => (
            <div
              key={`participant-draggable_${roomId}`}
              ref={participantDroppableProvided.innerRef}
              className={cn(
                'flex items-center m-2 px-2 pt-2 relative rounded-md transition-all border-2 border-transparent flex-wrap',
                {
                  'border-2 border-gray-600 animate-pulse':
                    snapshot.isDraggingOver,
                  'border-2 border-gray-400': snapshot.draggingFromThisWith,
                }
              )}
              {...participantDroppableProvided.droppableProps}>
              {participants?.length === 0 ? (
                <p className="text-sm text-gray-400">No participants</p>
              ) : null}

              {participants?.map((participant, index) => (
                <Draggable
                  key={`participant-draggable_${participant.customParticipantId}`}
                  index={index}
                  isDragDisabled={!isOwner}
                  draggableId={`participant-draggable_${participant.customParticipantId}`}>
                  {(sectionDraggableProvided) => (
                    <div
                      className="mb-2 items-center mr-2"
                      ref={sectionDraggableProvided.innerRef}
                      {...sectionDraggableProvided.draggableProps}
                      {...sectionDraggableProvided.dragHandleProps}>
                      <Tooltip content={participant?.displayName || ''}>
                        <Avatar
                          src={participant?.displayPictureUrl}
                          name={participant?.displayName}
                          showFallback
                        />
                      </Tooltip>
                    </div>
                  )}
                </Draggable>
              ))}
              <div className="inline-flex">
                {participantDroppableProvided.placeholder}
              </div>
            </div>
          )}
        </StrictModeDroppable>
      )}
      <RenderIf isTrue={!!JoinRoomButton}>
        <div className="h-10" />
        <div className="absolute bottom-0 right-0 left-0 mt-10">
          {JoinRoomButton}
        </div>
      </RenderIf>
    </div>
  )
}
