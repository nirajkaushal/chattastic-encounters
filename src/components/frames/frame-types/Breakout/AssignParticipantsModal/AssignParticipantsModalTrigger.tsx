
import { useState } from 'react'

import { ButtonProps } from '@heroui/button'
import { Users } from 'lucide-react'

import { AssignParticipantsModal } from './AssignParticipantsModal'

import { Button } from '@/components/ui/Button'

type AssignParticipantsModalTriggerProps = {
  children?: React.ReactNode
  triggerProps?: ButtonProps
}

export function AssignParticipantsModalTrigger({
  children,
  triggerProps = {},
}: AssignParticipantsModalTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button isIconOnly onPress={() => setOpen(true)} {...triggerProps}>
        {children ?? <Users size={18} />}
      </Button>
      <AssignParticipantsModal open={open} setOpen={setOpen} />
    </>
  )
}
