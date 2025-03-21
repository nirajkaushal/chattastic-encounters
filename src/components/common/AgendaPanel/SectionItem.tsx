
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react'

import { Chip } from '@heroui/react'
import { ChevronRight } from 'lucide-react'

import { AddItemBar } from './AddItemBar'
import { FrameList } from './FrameList'
import { ConfirmationModal } from '../ConfirmationModal'
import { EditableLabel } from '../EditableLabel'
import { RenderIf } from '../RenderIf/RenderIf'
import { SectionDropdownActions } from '../SectionDropdownActions'
import { Tooltip } from '../ShortuctTooltip'
import { StrictModeDroppable } from '../StrictModeDroppable'

import { useEventContext } from '@/contexts/EventContext'
import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { FrameService } from '@/services/frame.service'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import { FrameStatus } from '@/types/enums'
import {
  EventSessionMode,
  PresentationStatuses,
} from '@/types/event-session.type'
import { IFrame, ISection } from '@/types/frame.type'
import { getFilteredFramesByStatus } from '@/utils/event.util'
import { cn } from '@/utils/utils'

type SectionItemProps = {
  section: ISection
  actionDisabled: boolean
  startingIndex: number
  sectionCount: number
}

export function SectionItem({
  section,
  actionDisabled,
  startingIndex,
  sectionCount,
}: SectionItemProps) {
  const {
    eventMode,
    overviewOpen,
    insertInSectionId,
    setInsertAfterFrameId,
    setInsertInSectionId,
    updateSection,
    deleteSection,
    setOverviewOpen,
  } = useEventContext()
  const { permissions } = useEventPermissions()
  const currentFrame = useCurrentFrame()
  const {
    expandedSectionIds,
    currentSectionId,
    toggleExpandedSection,
    setCurrentSectionId,
  } = useAgendaPanel()
  const { leftSidebarVisiblity } = useStudioLayout()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const dispatch = useStoreDispatch()
  const isMeetingJoined = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.dyte.isMeetingJoined
  )
  const isHost = useStoreSelector(
    (store) => store.event.currentEvent.eventState.isCurrentUserOwnerOfEvent
  )
  const presentationStatus = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.presentationStatus
  )

  const getFrames = () => {
    if (!permissions.canUpdateFrame) {
      return getFilteredFramesByStatus({
        frames: section.frames,
        status: FrameStatus.PUBLISHED,
      })
    }

    if (eventMode === 'present') {
      return section.frames.filter((f) => !!f.type)
    }

    return section.frames
  }

  const frames = getFrames()

  const handleExpandSection = () => {
    toggleExpandedSection(section.id)
  }

  const handleSectionClick = () => {
    setOverviewOpen(false)

    setInsertInSectionId(section.id)
    setInsertAfterFrameId(null)
    setCurrentSectionId(section.id, { removeCurrentFrame: true })

    // Dispatch an action to update event session mode to 'Peek' if presentation is not started and user is the owner of the event
    if (
      isMeetingJoined &&
      isHost &&
      presentationStatus !== PresentationStatuses.STARTED
    ) {
      dispatch(updateEventSessionModeAction(EventSessionMode.PEEK))
    }
  }

  const sectionExpanded = expandedSectionIds.includes(section.id)
  const sidebarExpanded = leftSidebarVisiblity === 'maximized'
  const sectionActive = !overviewOpen && currentSectionId === section.id
  const isSectionEmptyOrCollapsed =
    !sectionExpanded || section.frames.length === 0

  const duplicateFrame = (frame: IFrame) => {
    FrameService.duplicateFrame({
      frameId: frame.id,
      meetingId: frame.meeting_id as string,
      sectionId: frame.section_id as string,
    })
  }

  const renderItem = ({ className }: { className: string }) => {
    if (sidebarExpanded) {
      return (
        <div
          className={cn(
            'flex justify-between items-center rounded-md px-2 group/section-item hover:bg-gray-200 hover:border-gray-200',
            {
              'bg-primary-100': sectionActive,
              'bg-gray-100': currentFrame?.section_id === section.id,
            },
            className
          )}>
          <div
            className="flex justify-start items-center flex-auto gap-2 h-8 border-0 rounded-md"
            onClick={handleExpandSection}>
            <ChevronRight
              size={18}
              className={cn('duration-300 shrink-0 cursor-pointer', {
                'rotate-90': sectionExpanded,
              })}
            />
            <EditableLabel
              readOnly={actionDisabled}
              label={section.name}
              className="text-sm font-semibold tracking-tight cursor-pointer"
              onClick={handleSectionClick}
              onUpdate={(value: string) => {
                updateSection({
                  sectionPayload: { name: value },
                  sectionId: section.id,
                })
              }}
            />
          </div>
          <RenderIf isTrue={sectionCount > 1}>
            <div className={cn('hidden group-hover/section-item:block')}>
              <SectionDropdownActions
                section={section}
                onDelete={() => setIsDeleteModalOpen(true)}
              />
            </div>
          </RenderIf>
        </div>
      )
    }

    return (
      <Tooltip
        label={
          <div className="flex items-center gap-2">
            <Chip size="sm" className="shrink-0">
              {section.frames.length}
            </Chip>

            {section.name}
          </div>
        }
        placement="right"
        showArrow>
        <div
          className={cn('flex gap-1.5 items-center py-1')}
          onClick={handleSectionClick}>
          <ChevronRight
            size={18}
            className={cn('duration-300 shrink-0 cursor-pointer', {
              'rotate-90 text-primary': sectionExpanded,
            })}
          />

          <svg
            width="24"
            height="19"
            viewBox="0 0 24 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21.1242 7.40426C20.7546 6.91533 20.2868 6.53538 19.7671 6.25316V4.58333C19.7671 2.05608 17.7964 0 15.3742 0H6.5885C4.16629 0 2.19565 2.05608 2.19565 4.58333V6.25316C1.67587 6.53538 1.20814 6.91533 0.838482 7.40426C0.0985061 8.3828 -0.168579 9.62821 0.104876 10.821L1.00947 14.7631C1.49269 16.8653 3.35767 18.3333 5.54443 18.3333H16.4183C18.605 18.3333 20.4701 16.8652 20.9532 14.7627L21.8578 10.8211C22.1313 9.62821 21.8643 8.3828 21.1242 7.40426ZM4.39208 4.58333C4.39208 3.31948 5.37718 2.29167 6.5885 2.29167H15.3742C16.5855 2.29167 17.5706 3.31948 17.5706 4.58333V5.72917H4.39208V4.58333ZM19.7215 10.2873L18.8169 14.2284C18.5755 15.2791 17.5669 16.0417 16.4183 16.0417H5.54443C4.39581 16.0417 3.3871 15.2791 3.14583 14.229L2.24123 10.2873C2.12328 9.77373 2.23749 9.25386 2.56301 8.82372C2.94848 8.31348 3.55337 8.02083 4.22208 8.02083H17.7406C18.4093 8.02083 19.0142 8.31348 19.3997 8.82372C19.7252 9.25398 19.8394 9.77373 19.7215 10.2873Z"
              className={sectionActive ? 'fill-primary' : 'fill-gray-500'}
            />
            <path
              d="M12.4014 10.6482L10.9814 12.1296L9.56139 10.6481C9.13243 10.2005 8.43748 10.2005 8.00841 10.6481C7.57934 11.0956 7.57945 11.8207 8.00841 12.2684L10.2048 14.5601C10.4194 14.7839 10.7003 14.8958 10.9814 14.8958C11.2624 14.8958 11.5433 14.7839 11.7578 14.5601L13.9542 12.2684C14.3832 11.8208 14.3832 11.0958 13.9542 10.6481C13.5253 10.2004 12.8303 10.2005 12.4014 10.6482Z"
              className={sectionActive ? 'fill-primary' : 'fill-gray-500'}
            />
          </svg>
        </div>
      </Tooltip>
    )
  }

  if (frames.length === 0 && !permissions.canUpdateFrame) {
    return null
  }

  return (
    <div>
      <StrictModeDroppable
        droppableId={`frame-droppable-sectionId-${section.id}`}
        direction={isSectionEmptyOrCollapsed ? 'horizontal' : 'vertical'}
        type="frame">
        {(frameDroppableProvided, snapshot) => (
          <div
            key={`frame-draggable-${section.id}`}
            ref={frameDroppableProvided.innerRef}
            className={cn('relative rounded-sm transition-all w-full', {
              '!bg-green-100': snapshot.isDraggingOver,
            })}
            {...frameDroppableProvided.droppableProps}>
            {renderItem({
              className: snapshot.isDraggingOver ? 'bg-green-100' : '',
            })}

            <FrameList
              frames={frames}
              showList={sectionExpanded}
              droppablePlaceholder={frameDroppableProvided.placeholder}
              duplicateFrame={duplicateFrame}
              sectionStartingIndex={startingIndex}
              actionDisabled={actionDisabled}
            />
            <RenderIf isTrue={section.frames.length === 0 || !sectionExpanded}>
              <AddItemBar sectionId={section.id!} frameId="" />
            </RenderIf>

            <RenderIf
              isTrue={!sidebarExpanded && sectionExpanded && frames.length > 2}>
              <div
                className={cn(
                  'h-full w-0 absolute border-l-1 border-dashed -top-0.5 left-1.5 border-gray-400  after:absolute after:w-[5px] after:h-[5px] after:rounded-full after:bg-gray-400  after:-left-[3px] after:bottom-0',
                  {
                    'border-primary after:bg-primary':
                      sectionActive || insertInSectionId === section.id,
                  }
                )}
              />

              <p
                style={{ writingMode: 'vertical-lr' }}
                className={cn(
                  'absolute -left-0.5 -translate-y-[50%] text-xs py-2 h-max font origin-center top-[45%] rotate-180 bg-background min-w-max text-gray-400 w-fit',
                  {
                    'text-primary font-bold':
                      sectionActive || insertInSectionId === section.id,
                  }
                )}>
                {section.name.slice(0, section.frames.length * 3)}
              </p>
            </RenderIf>
          </div>
        )}
      </StrictModeDroppable>
      <ConfirmationModal
        open={isDeleteModalOpen}
        description={
          <p>
            Are you sure to delete this section <strong>{section.name}</strong>?
            This will also delete <strong>{section.frames.length}</strong>{' '}
            {section.frames.length > 1 ? 'frames' : 'frame'}.
          </p>
        }
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteSection({
            sectionId: section.id,
          })
          setIsDeleteModalOpen(false)
        }}
      />
    </div>
  )
}
