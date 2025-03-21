
import { useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@heroui/react'
import { toast } from 'react-hot-toast'
import { MoreVertical, UserPlus2, Settings, VolumeX } from 'lucide-react'

import { AddParticipantsButtonWithModal } from '@/components/common/AddParticipantsButtonWithModal'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useDyteParticipants } from '@/hooks/useDyteParticipants'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { openChangeContentTilesLayoutModalAction } from '@/stores/slices/layout/live.slice'
import { cn } from '@/utils/utils'

export function MoreActions() {
  const { joinedParticipants } = useDyteParticipants()

  const { setDyteStates, isHost } = useEventSession()
  const [open, setOpen] = useState(false)

  const addParticipantsDisclosure = useDisclosure()

  const { meeting } = useDyteMeeting()

  const dispatch = useStoreDispatch()
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )

  const handleMicDisable = async () => {
    joinedParticipants.forEach((p) => {
      meeting.participants.disableAudio(p.id)
    })
    toast.success('All participant muted')
  }

  const renderMenuItems = () => {
    const items = []

    if (isHost && !isInBreakoutMeeting) {
      items.push(
        <DropdownItem
          key="add-participants"
          startContent={<UserPlus2 />}
          onClick={() => {
            addParticipantsDisclosure.onOpen()
          }}>
          Add new participant
        </DropdownItem>
      )
      items.push(
        <DropdownItem
          key="mute-participants"
          startContent={<VolumeX />}
          onClick={handleMicDisable}>
          Mute all participants
        </DropdownItem>
      )
    }

    items.push(
      <DropdownItem
        key="change-layout"
        startContent={<Settings />}
        onClick={() => {
          dispatch(openChangeContentTilesLayoutModalAction())
        }}>
        Change Layout
      </DropdownItem>
    )

    items.push(
      <DropdownItem
        key="settings"
        startContent={<Settings />}
        onClick={() => {
          setDyteStates((prevDyteStates) => ({
            ...prevDyteStates,
            activeSettings: true,
          }))
        }}>
        Video settings
      </DropdownItem>
    )

    return items
  }

  return (
    <div>
      <Dropdown offset={10} onOpenChange={setOpen}>
        <DropdownTrigger>
          <Button
            variant="light"
            className={cn('live-button', {
              active: open,
            })}
            isIconOnly>
            <MoreVertical size={18} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>{renderMenuItems()}</DropdownMenu>
      </Dropdown>
      {isHost && (
        <AddParticipantsButtonWithModal
          showLabel={false}
          disclosure={addParticipantsDisclosure}
        />
      )}
    </div>
  )
}
