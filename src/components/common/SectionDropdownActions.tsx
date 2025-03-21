
import { useContext } from 'react'

import { Button } from '@heroui/react'
import { ArrowDown, ArrowUp, Trash, MoreVertical } from 'lucide-react'

import { DropdownActions } from './DropdownActions'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventContextType } from '@/types/event-context.type'
import { ISection } from '@/types/frame.type'

const sectionDropdownActions = [
  {
    key: 'delete',
    label: 'Delete',
    icon: <Trash className="h-4 w-4 text-red-500" />,
  },
  {
    key: 'move-up',
    label: 'Move up',
    icon: <ArrowUp className="h-4 w-4 text-slate-500" />,
  },
  {
    key: 'move-down',
    label: 'Move down',
    icon: <ArrowDown className="h-4 w-4 text-slate-500" />,
  },
]

export function SectionDropdownActions({
  section,
  onDelete,
}: {
  section: ISection
  onDelete: (section: ISection) => void
}) {
  const { eventMode, preview, moveUpSection, moveDownSection } = useContext(
    EventContext
  ) as EventContextType

  const { permissions } = useEventPermissions()

  if (!permissions.canUpdateSection || preview || eventMode !== 'edit') {
    return null
  }

  return (
    <DropdownActions
      triggerIcon={
        <Button isIconOnly size="sm" variant="light" radius="full">
          <MoreVertical size={18} />
        </Button>
      }
      actions={sectionDropdownActions}
      onAction={(actionKey) => {
        if (actionKey === 'delete') {
          onDelete(section)
        }
        if (actionKey === 'move-up') {
          moveUpSection(section)
        }
        if (actionKey === 'move-down') {
          moveDownSection(section)
        }
      }}
    />
  )
}
