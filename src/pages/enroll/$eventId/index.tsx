import { useEffect, useState } from 'react'

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useLocation,
  useParams,
  useRouter,
} from '@tanstack/react-router'
import toast from 'react-hot-toast'
import { FaCheckCircle } from 'react-icons/fa'

import { ParticipantsFormData } from '@/components/common/AddParticipantsForm'
import { ContentLoading } from '@/components/common/ContentLoading'
import { LogoWithName } from '@/components/common/Logo'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Participantslist } from '@/components/enroll/ParticipantList'
import { EventImage } from '@/components/event-details/EventImage'
import { EventTimeline } from '@/components/event-details/Timeline'
import { ThemeEffects } from '@/components/events/ThemeEffects'
import { Editor as RichTextEditor } from '@/components/frames/frame-types/RichText/Editor'
import { useAuth } from '@/hooks/useAuth'
import { usePublicEvent } from '@/hooks/useEvent'
import { EventService } from '@/services/event/event-service'
import { EventStatus } from '@/types/enums'
import { cn } from '@/utils/utils'

export const Route = createFileRoute('/enroll/$eventId/')({
  component: Visit,
})

export function Visit() {
  const router = useRouter()
  const location = useLocation()
  const { eventId } = useParams({ strict: false })
  const { redirectTo, ...restParams } = location.search as {
    redirectTo: string
    [key: string]: string
  }

  const user = useAuth()

  const descriptionModalDisclosure = useDisclosure()

  const [showEditor, setShowEditor] = useState(true)
  const useEventData = usePublicEvent({
    id: eventId as string,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const event = useEventData.event as any

  const participants =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useEventData?.participants?.map((p: any) => ({
      email: p.email,
      role: p.event_role,
      profile: p.profile,
    })) || []

  const isEventOwner = user?.currentUser?.id === event?.owner_id

  const isLoggedIn = user?.currentUser?.id
  const isEnrolled = !!useEventData.participants?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) => p.email === user?.currentUser?.email
  )

  const addParticipantsMutation = useMutation({
    mutationFn: async ({
      participants: _participants,
    }: ParticipantsFormData) => {
      try {
        const addResponse = await EventService.addParticipant({
          eventId: eventId as string,
          participants: _participants,
        })

        if (JSON.parse(addResponse?.data || '')?.success) {
          router.navigate({
            to: redirectTo,
          })
        }

        toast.success('Enrolled successfully.')
      } catch (err) {
        console.error(err)
        toast.error('Failed to enrolled participants')
      }
    },
  })

  useEffect(() => {
    if (restParams.autoEnroll && !isEnrolled && !useEventData.isFetching) {
      addParticipantsMutation.mutate({
        participants: [
          ...participants,
          { email: user.currentUser.email, role: 'Participant' },
        ],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restParams.autoEnroll, isEnrolled, useEventData.isFetching])

  useEffect(() => {
    if (isLoggedIn && isEnrolled) {
      router.navigate({ to: redirectTo })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isEnrolled])

  const handleEnrollClick = () => {
    if (isEnrolled) {
      router.navigate({
        to: redirectTo || `/events/${eventId}`,
      })

      return
    }

    if (!isLoggedIn) {
      router.navigate({
        to: '/login',
        search: {
          redirectTo: `/enroll/${event.id}`,
          originalUrl: redirectTo,
          autoEnroll: true,
        },
      })

      return
    }

    addParticipantsMutation.mutate({
      participants: [
        ...participants,
        { email: user.currentUser.email, role: 'Participant' },
      ],
    })
  }

  if (useEventData.isLoading) {
    return <ContentLoading fullPage />
  }

  if (!event) return null

  const visibleUserNote = () => {
    // For owner don't show label
    if (!isLoggedIn) return false
    if (user.currentUser.id === event.owner_id) return false
    // For learner show label when event is not published
    if (isEnrolled && event.status !== EventStatus.ACTIVE) return true

    return false
  }

  const visibleEnrollButton = () => {
    if (!isLoggedIn) return true
    if (user.currentUser.id === event.owner_id) return false
    if (!isEnrolled) return true

    return false
  }

  const visibleEventButton = () => {
    if (!isLoggedIn) return false

    if (user.currentUser.id === event.owner_id) return true

    if (isEnrolled && event.status === EventStatus.ACTIVE) return true

    return false
  }

  return (
    <ThemeEffects selectedTheme={event.theme} className="h-screen">
      <Link to="/">
        <LogoWithName primary className="m-4" />
      </Link>
      <div className="overflow-y-scroll h-full relative z-[50] pb-40">
        <div className="max-w-[76.25rem] mx-auto py-4 pt-8">
          <div className="grid grid-cols-[60%_27%] items-start gap-6">
            <div className="h-full flex flex-col gap-5">
              <p className="text-[40px] font-semibold leading-[46px]">
                {event.name}
              </p>

              <RenderIf isTrue={!!event.description}>
                <div
                  className={cn('text-sm rounded-xl', {
                    'p-4 pb-1 bg-default/20 backdrop-blur-3xl':
                      event?.theme?.theme === 'Emoji',
                  })}>
                  <p className="line-clamp-[7] text-base break-words">
                    {event.description}
                  </p>
                  <RenderIf isTrue={event?.description?.length > 400}>
                    <Button
                      variant="faded"
                      className="text-xs text-gray-400 cursor-pointer w-fit p-1 h-6 border-1 my-2"
                      onClick={() => descriptionModalDisclosure.onOpen()}>
                      Read More
                    </Button>
                  </RenderIf>
                </div>
              </RenderIf>
              <RenderIf isTrue={!!showEditor}>
                <p className="text-gray-600 border-b pb-3 text-sm font-medium">
                  Event details
                </p>
              </RenderIf>

              <RenderIf isTrue={!!showEditor}>
                <div
                  className={cn('rounded-xl', {
                    'p-4 bg-default/20 shadow-sm  backdrop-blur-3xl ':
                      event?.theme?.theme === 'Emoji',
                  })}>
                  <RichTextEditor
                    editorId={eventId!}
                    showHeader={false}
                    editable={false}
                    hideSideBar
                    classNames={{ editorInPreview: 'overflow-y-visible' }}
                    onEmptyContent={() => setShowEditor(false)}
                  />
                </div>
              </RenderIf>
            </div>
            <div className="flex flex-col gap-6">
              <EventImage src={event?.image_url} />
              <RenderIf isTrue={visibleUserNote()}>
                <div className="flex items-center gap-2 bg-green-100 p-4 rounded-sm border-green-200 border">
                  <FaCheckCircle className="text-green-600 text-2xl shrink-0" />
                  <p className="text-sm text-slate-500">
                    You&apos;re enrolled! You’ll gain access to the event once
                    it’s officially published by the host.
                  </p>
                </div>
              </RenderIf>
              <RenderIf isTrue={visibleEnrollButton()}>
                <Button
                  type="submit"
                  className="w-full bg-black text-white shadow-xl"
                  isLoading={addParticipantsMutation.isPending}
                  onClick={handleEnrollClick}>
                  {addParticipantsMutation.isPending ? 'Enrolling' : 'Enroll'}
                </Button>
              </RenderIf>
              <EventTimeline event={event} hosts={useEventData.hosts} />
              <RenderIf isTrue={visibleEventButton()}>
                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    className="w-full bg-black text-white shadow-xl"
                    isLoading={addParticipantsMutation.isPending}
                    onClick={handleEnrollClick}>
                    Go to event
                  </Button>
                </div>
              </RenderIf>

              <Participantslist
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                participants={useEventData.participants as any}
                hosts={useEventData.hosts}
                visibleInvitedTab={isEventOwner}
              />
            </div>
          </div>

          <Modal
            size="xl"
            isOpen={descriptionModalDisclosure?.isOpen}
            onClose={descriptionModalDisclosure.onClose}>
            <ModalContent>
              {() => (
                <>
                  <ModalHeader className="flex flex-col gap-1 bg-primary text-white p-6">
                    <h2 className="font-md font-semibold">Description</h2>
                  </ModalHeader>
                  <ModalBody className="mt-4 mb-4">
                    <p>{event.description}</p>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </ThemeEffects>
  )
}
