/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */

import { createContext, useContext, useEffect, useState } from 'react'

import { useParams, useRouter } from '@tanstack/react-router'
import { OnDragEndResponder } from 'react-beautiful-dnd'
import toast from 'react-hot-toast'

import { useSyncValueInRedux } from '@/hooks/syncValueInRedux'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { FrameService } from '@/services/frame.service'
import { LibraryService } from '@/services/library.service'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import {
  useEventLoadingSelector,
  useEventSelector,
} from '@/stores/hooks/useEventSections'
import {
  setCurrentEventIdAction,
  setCurrentSectionIdAction,
  setIsOverviewOpenAction,
  setIsPreviewOpenAction,
  setCurrentFrameIdAction,
} from '@/stores/slices/event/current-event/event.slice'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { reorderSectionsAction } from '@/stores/slices/event/current-event/meeting.slice'
import {
  reorderFrameAction,
  toggleSectionExpansionInPlannerAction,
} from '@/stores/slices/event/current-event/section.slice'
import { setExpandedSectionsAction } from '@/stores/slices/layout/studio.slice'
import {
  createFrameThunk,
  deleteFramesThunk,
  deleteFrameThunk,
  updateFrameThunk,
} from '@/stores/thunks/frame.thunks'
import {
  createSectionThunk,
  deleteSectionThunk,
  updateSectionThunk,
} from '@/stores/thunks/section.thunks'
import { EventContextType, EventModeType } from '@/types/event-context.type'
import { ISection, IFrame } from '@/types/frame.type'
import { FrameModel } from '@/types/models'
import { Json } from '@/types/supabase-db'
import { getFrameActivities } from '@/utils/breakout.utils'
import {
  getAllNestedBreakoutActivities,
  getSectionByFrameId,
} from '@/utils/drag.utils'
import { withPermissionCheck } from '@/utils/permissions'
import { supabaseClient } from '@/utils/supabase/client'

interface EventProviderProps {
  children: React.ReactNode
  eventMode: EventModeType
}

export const EventContext = createContext<EventContextType | null>(null)

export function EventProvider({ children, eventMode }: EventProviderProps) {
  const { eventId } = useParams({ strict: false })
  const currentFrame = useCurrentFrame()
  const expandedSectionIds = useStoreSelector(
    (state) => state.layout.studio.expandedSections
  )
  const isOverviewOpen = useStoreSelector(
    (store) => store.event.currentEvent.eventState.isOverviewOpen
  )
  const currentSectionId = useStoreSelector(
    (store) => store.event.currentEvent.eventState.currentSectionId
  )
  const isOwner = useStoreSelector(
    (store) => store.event.currentEvent.eventState.isCurrentUserOwnerOfEvent
  )
  const isMeetingJoined = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.dyte.isMeetingJoined
  )
  const dispatch = useStoreDispatch()
  const router = useRouter()
  const searchParams = router.latestLocation.search as {
    action: string
    frameId?: string
  }

  const currentUser = useStoreSelector((state) => state.user.currentUser.user)
  const { permissions } = useEventPermissions()

  const { sections } = useEventSelector()
  const allFrames = useStoreSelector(
    (state) => state.event.currentEvent.frameState.frame.data
  )

  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)
  const loading = useEventLoadingSelector()
  const syncing = useStoreSelector(
    (state) => state.event.currentEvent.frameState.updateFrameThunk.isLoading
  )
  useSyncValueInRedux({
    value: eventId || null,
    reduxStateSelector: (state) => state.event.currentEvent.eventState.eventId,
    actionFn: setCurrentEventIdAction,
  })
  const event = useStoreSelector(
    (state) => state.event.currentEvent.eventState.event.data
  )
  const meeting = useStoreSelector(
    (state) => state.event.currentEvent.meetingState.meeting.data
  )
  const [insertAfterFrameId, setInsertAfterFrameId] = useState<string | null>(
    null
  )
  const [insertAfterSectionId, setInsertAfterSectionId] = useState<
    string | null
  >(null)
  const [insertInSectionId, setInsertInSectionId] = useState<string | null>(
    null
  )
  const [, setAddedFromSessionPlanner] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>('')

  const isPreviewOpen = useStoreSelector(
    (state) => state.event.currentEvent.eventState.isPreviewOpen
  )

  const [error, setError] = useState<{
    frameId: string
    message: string
  } | null>(null)

  useEffect(() => {
    if (!event?.owner_id || !currentUser?.id) return

    if (event.owner_id !== currentUser.id) return

    if (searchParams?.frameId) {
      const frame = getFrameById(searchParams.frameId)

      if (!frame) return

      handleSetCurrentFrame(frame)
    }

    if (searchParams.action === 'view') {
      dispatch(setIsPreviewOpenAction(true))

      return
    }

    dispatch(setIsPreviewOpenAction(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentUser?.id,
    event?.owner_id,
    searchParams?.frameId,
    searchParams?.action,
  ])

  const handleSectionExpansionInSessionPlanner = (sectionId: string) => {
    if (isOverviewOpen) {
      dispatch(
        toggleSectionExpansionInPlannerAction({
          id: sectionId,
          keepExpanded: true,
        })
      )
    }
  }

  const addFrameToSection = async ({
    frame,
    section,
    afterFrameId,
  }: {
    frame: Partial<IFrame>
    section: ISection
    afterFrameId?: string
  }) => {
    dispatch(
      createFrameThunk({
        frame: frame as Partial<FrameModel>,
        insertAfterFrameId: afterFrameId,
        meetingId: meeting!.id,
        sectionId: section!.id,
      })
    )

    handleSectionExpansionInSessionPlanner(section.id)
    setInsertAfterFrameId(frame.id!)
    router.navigate({
      search: { ...searchParams, frameId: frame.id },
    })
  }

  const saveFrameInLibrary = async (frame: Partial<IFrame>) => {
    if (!frame.id) return
    try {
      await LibraryService.saveFrameInLibrary(frame.id, currentUser!.id)
      toast.success('Frame saved in library')
    } catch (err) {
      console.error(err)
      toast.error('Failed to save frame in library')
    }
  }

  const addSection = async ({
    name,
    afterSectionId,
  }: Parameters<EventContextType['addSection']>[0]) => {
    const sectionName = name || `Section ${(sections?.length || 0) + 1}`

    dispatch(
      createSectionThunk({
        meetingId: meeting!.id,
        sectionName,
        frameIds: [],
        insertAfterSectionId: afterSectionId,
      })
    )
  }

  const updateSection = async ({
    sectionPayload,
    sectionId,
  }: {
    sectionPayload: {
      name?: string
      frames?: string[]
      config?: Json
    }
    sectionId: string
  }) => {
    dispatch(
      updateSectionThunk({
        sectionId,
        data: {
          name: sectionPayload.name || null,
          frames: sectionPayload.frames || null,
          config: sectionPayload.config || null,
        },
      })
    )
  }

  const deleteSection = async ({ sectionId }: { sectionId: string }) => {
    dispatch(deleteSectionThunk({ sectionId }))

    return true
  }

  const importGoogleSlides = async ({
    frame,
    googleSlideUrl,
    startPosition,
    endPosition,
  }: {
    frame: IFrame
    googleSlideUrl: string
    startPosition: number
    endPosition: number | undefined
  }) => {
    const importGoogleSlidesResponse = await supabaseClient.functions.invoke(
      'import-google-slides',
      {
        body: {
          googleSlideUrl,
          meetingId: meeting!.id,
          sectionId: frame.section_id,
          uploaderFrameId: frame.id,
          startPosition,
          endPosition,
        },
      }
    )
    if (!importGoogleSlidesResponse.data?.success) {
      console.error(
        'error while importing google Slides: ',
        importGoogleSlidesResponse.data?.message
      )

      setError({
        frameId: frame.id,
        message: importGoogleSlidesResponse.data?.message,
      })

      return importGoogleSlidesResponse.data
    }

    // const { insertedFrames: insertedFrameIds } = importGoogleSlidesResponse.data

    // const section = sections.find((s) => s.id === frame.section_id)
    // const existingFrameIds = section?.frames.map((s: IFrame) => s.id) || []
    // const existingFrameIdsWithoutGoogleSlideId = existingFrameIds.filter(
    //   (sid: string) => sid !== frame.id
    // )
    // const updatedFrameIds = [
    //   ...existingFrameIdsWithoutGoogleSlideId,
    //   ...insertedFrameIds,
    // ]

    // // Update section
    // const sectionData = await updateSection({
    //   sectionPayload: {
    //     frames: updatedFrameIds,
    //   },
    //   sectionId: frame.section_id,
    // })

    // if (!sectionData) return null

    // // Delete the google import frame
    // const deleteFrameResponse = await FrameService.deleteFrame(frame.id)

    // if (deleteFrameResponse.error) {
    //   console.error('error while deleting frame: ', deleteFrameResponse.error)

    //   return null
    // }

    return importGoogleSlidesResponse.data
  }

  const updateFrame = async ({
    framePayload,
    frameId,
    // allowParticipantToUpdate = false,
  }: {
    framePayload: Partial<IFrame>
    frameId: string
    // allowParticipantToUpdate?: boolean
  }) => {
    // if (!allowParticipantToUpdate) return null
    if (!frameId) return null
    if (Object.keys(framePayload).length === 0) return null

    dispatch(
      updateFrameThunk({
        frameId,
        frame: framePayload as Partial<FrameModel>,
      })
    )

    return null
  }

  const deleteFrame = async (frame: IFrame) => {
    dispatch(deleteFrameThunk({ frameId: frame.id }))

    return null
  }

  const deleteFrames = async ({
    frameIds,
    sectionId,
  }: {
    frameIds: string[]
    sectionId: string
  }) => {
    dispatch(deleteFramesThunk({ frameIds, sectionId }))

    return null
  }

  const deleteBreakoutFrames = async (frame: IFrame) => {
    await FrameService.deleteActivitiesOfBreakoutFrame({
      breakoutFrameId: frame.id,
    })
    // Update the section with the frame
    const section = sections.find((s) => s.id === frame.section_id)

    const _frames = section!.frames.filter((s) => s?.id !== frame.id)

    await updateSection({
      sectionPayload: {
        frames: _frames.map((s) => s?.id),
      },
      sectionId: section!.id,
    })

    await FrameService.deleteFrame(frame.id)

    return null
  }

  const moveUpFrame = (frame: IFrame) => {
    const section = sections.find((s) => s.id === frame.section_id)
    const index = section!.frames.findIndex((s) => s?.id === frame.id)
    if (index === 0) return

    dispatch(
      reorderFrameAction({
        destinationSectionId: section!.id,
        destinationIndex: index - 1,
        frameIds: [frame.id],
        nestedActivities: getAllNestedBreakoutActivities(
          sections as ISection[]
        ),
      })
    )
  }

  const moveUpSection = async (section: ISection) => {
    const index = sections.findIndex((s) => s.id === section.id)
    if (index === 0) return

    dispatch(
      reorderSectionsAction({
        destinationIndex: index - 1,
        sourceIndex: index,
      })
    )
  }

  const moveDownSection = async (section: ISection) => {
    const index = sections.findIndex((s) => s.id === section.id)
    if (index === sections.length - 1) return

    dispatch(
      reorderSectionsAction({
        destinationIndex: index + 1,
        sourceIndex: index,
      })
    )
  }

  const moveDownFrame = async (frame: IFrame) => {
    const section = sections.find((s) => s.id === frame.section_id)
    const index = section!.frames.findIndex((s) => s?.id === frame.id)
    if (index === section!.frames.length - 1) return

    dispatch(
      reorderFrameAction({
        destinationSectionId: section!.id,
        destinationIndex: index + 1,
        frameIds: [frame.id],
        nestedActivities: getAllNestedBreakoutActivities(
          sections as ISection[]
        ),
      })
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reorderFrame = async (result: OnDragEndResponder | any) => {
    const { destination, draggableId } = result
    const frameId = draggableId.split('frame-draggable-frameId-')[1]

    const destinationSectionId = destination.droppableId.split(
      'frame-droppable-sectionId-'
    )[1]

    if (!destination) return null

    const section = getSectionByFrameId(sections as ISection[], frameId)

    dispatch(
      reorderFrameAction({
        frameIds: [
          frameId,
          ...getFrameActivities(section as ISection, frameId),
        ],
        destinationSectionId,
        destinationIndex: result.destination.index,
        nestedActivities: getAllNestedBreakoutActivities(
          sections as ISection[]
        ),
      })
    )

    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reorderSection = async (result: OnDragEndResponder | any) => {
    const { source, destination } = result
    if (destination.droppableId !== 'section-droppable') return
    if (source.droppableId !== 'section-droppable') return

    dispatch(
      reorderSectionsAction({
        sourceIndex: source.index as number,
        destinationIndex: destination.index as number,
      })
    )
  }

  const getFrameById = (frameId: string): IFrame => {
    const _frame = (allFrames || [])?.find((f) => f?.id === frameId) as IFrame

    return _frame
  }

  const handleSetCurrentFrame = (frame: IFrame | null) => {
    if (frame && isOverviewOpen) dispatch(setIsOverviewOpenAction(false))

    dispatch(setCurrentFrameIdAction(frame?.id || null))
    dispatch(setCurrentSectionIdAction(null))
    dispatch(
      setExpandedSectionsAction(
        frame?.section_id && !expandedSectionIds.includes(frame?.section_id)
          ? [...expandedSectionIds, frame?.section_id]
          : expandedSectionIds
      )
    )

    if (!isMeetingJoined) return

    dispatch(
      updateMeetingSessionDataAction({
        currentFrameId: frame?.id,
        currentSectionId: null,
      })
    )
  }

  const handleSetCurrentSectionId = (
    sectionId: string | null,
    {
      removeCurrentFrame,
    }: {
      removeCurrentFrame?: boolean
    } = {}
  ) => {
    dispatch(setCurrentSectionIdAction(sectionId))

    if (removeCurrentFrame) dispatch(setCurrentFrameIdAction(null))
    if (!isMeetingJoined) return

    const frameIdObject = removeCurrentFrame
      ? {
          currentFrameId: null,
        }
      : {}
    dispatch(
      updateMeetingSessionDataAction({
        currentSectionId: sectionId,
        ...frameIdObject,
      })
    )
  }

  const actions = {
    updateFrame: withPermissionCheck(updateFrame, permissions.canUpdateFrame),
    deleteFrame: withPermissionCheck(deleteFrame, permissions.canDeleteFrame),
    deleteFrames: withPermissionCheck(deleteFrames, permissions.canDeleteFrame),

    moveUpFrame: withPermissionCheck(moveUpFrame, permissions.canUpdateFrame),
    moveDownFrame: withPermissionCheck(
      moveDownFrame,
      permissions.canUpdateFrame
    ),
    reorderFrame: withPermissionCheck(reorderFrame, permissions.canUpdateFrame),
    reorderSection: withPermissionCheck(
      reorderSection,
      permissions.canUpdateSection
    ),
    addSection: withPermissionCheck(addSection, permissions.canCreateSection),
    updateSection: withPermissionCheck(
      updateSection,
      permissions.canUpdateSection
    ),
    deleteSection: withPermissionCheck(
      deleteSection,
      permissions.canDeleteSection
    ),
    addFrameToSection: withPermissionCheck(
      addFrameToSection,
      permissions.canCreateFrame
    ),
    moveUpSection: withPermissionCheck(
      moveUpSection,
      permissions.canUpdateSection
    ),
    moveDownSection: withPermissionCheck(
      moveDownSection,
      permissions.canUpdateSection
    ),

    importGoogleSlides: withPermissionCheck(
      importGoogleSlides,
      permissions.canUpdateFrame
    ),
    deleteBreakoutFrames: withPermissionCheck(
      deleteBreakoutFrames,
      permissions.canDeleteFrame
    ),
  }

  return (
    <EventContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        eventId: eventId as string,
        eventMode:
          eventMode !== 'present'
            ? permissions.canUpdateFrame
              ? 'edit'
              : 'view'
            : eventMode,
        meeting,
        currentFrame: currentFrame as IFrame | null,
        overviewOpen: isOverviewOpen,
        loading,
        syncing,
        isOwner: isOwner || false,
        sections: sections as ISection[],
        preview: isPreviewOpen,
        error,
        openContentTypePicker,
        currentSectionId,
        insertAfterSectionId,
        insertAfterFrameId,
        insertInSectionId,
        selectedSectionId,
        setOpenContentTypePicker,
        saveFrameInLibrary,
        setPreview: (preview) => dispatch(setIsPreviewOpenAction(preview)),
        setCurrentFrame: handleSetCurrentFrame,
        setCurrentSectionId: handleSetCurrentSectionId,
        setOverviewOpen: (open) => {
          dispatch(setCurrentFrameIdAction(null))
          dispatch(setIsOverviewOpenAction(open))
        },
        setInsertAfterSectionId,
        setInsertAfterFrameId,
        setInsertInSectionId,
        setSelectedSectionId,
        getFrameById,
        setAddedFromSessionPlanner,
        ...actions,
      }}>
      {children}
    </EventContext.Provider>
  )
}

export function useEventContext() {
  const context = useContext(EventContext) as EventContextType

  if (!context) {
    throw new Error(
      'useEventContext must be used within `EventContextProvider`'
    )
  }

  return context
}
