import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { FrameResponseService } from '@/services/frame-response.service'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { toggleStartAndStopActivityAction } from '@/stores/slices/event/current-event/live-session.slice'
import { PresentationStatuses } from '@/types/event-session.type'

export function PollControls() {
  const { presentationStatus } = useEventSession()
  const [openResetConfirmationModal, setOpenResetConfirmationModal] =
    useState(false)
  const frame = useCurrentFrame()
  const dispatch = useStoreDispatch()
  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data
  )

  const deleteResponsesMutation = useMutation({
    mutationFn: () =>
      FrameResponseService.deleteResponses(frame?.id as string).then(() => {
        setOpenResetConfirmationModal(false)
      }),
    onSuccess: () =>
      toast.success(
        'All responses were cleared. The poll is now ready for new submissions.'
      ),
    onError: () => toast.success('Failed to reset'),
  })

  if (!frame) return null

  const pollStarted = session?.data?.framesConfig?.[frame.id]?.pollStarted

  return (
    <>
      <RenderIf isTrue={presentationStatus === PresentationStatuses.STARTED}>
        <Button
          title="Start poll"
          color={pollStarted ? 'danger' : 'primary'}
          onClick={() => {
            dispatch(
              toggleStartAndStopActivityAction({
                frameId: frame.id,
                activity: 'poll',
              })
            )
          }}>
          {pollStarted ? 'End' : 'Start'} Poll
        </Button>
      </RenderIf>
      <Button
        title="Reset poll"
        disabled={pollStarted}
        onClick={() => {
          if (pollStarted) return
          setOpenResetConfirmationModal(true)
        }}>
        Reset Poll
      </Button>
      {/* <PollConfigs /> */}
      <ConfirmationModal
        open={openResetConfirmationModal}
        title="Are you sure you want to reset this poll?"
        description="All current responses will be permanently removed, and
                participants will need to submit their answers again. This
                action cannot be undone."
        onConfirm={() => deleteResponsesMutation.mutate()}
        onClose={() => setOpenResetConfirmationModal(false)}
      />
    </>
  )
}
