
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react'
import { ArrowDown, ArrowUp, Copy, Save, Trash } from 'lucide-react'

import { FrameType } from '@/utils/frame-picker.util'

export const frameActions = [
  {
    key: 'delete',
    label: 'Delete',
    icon: <Trash className="h-4 w-4 text-slate-500" />,
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
  {
    key: 'duplicate-frame',
    label: 'Duplicate frame',
    icon: <Copy className="h-4 w-4 text-slate-500" />,
  },
  {
    key: 'save-frame-in-library',
    label: 'Save to library',
    icon: <Save className="h-4 w-4 text-slate-500" />,
    disableForFrames: [FrameType.BREAKOUT],
  },
]

export function FrameActions({
  triggerIcon,
  frameType,
  handleActions,
}: {
  triggerIcon: React.ReactNode
  frameType: FrameType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleActions: (item: any) => void
}) {
  const disabledKeys = !frameType ? ['save-frame-in-library'] : []

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>{triggerIcon}</DropdownTrigger>
      <DropdownMenu
        aria-label="Dropdown menu with icons"
        disabledKeys={disabledKeys}
        items={frameActions.filter(
          (action) => !action.disableForFrames?.includes(frameType)
        )}>
        {(item) => (
          <DropdownItem
            key={item.key}
            color="default"
            startContent={item.icon}
            className="flex items-center gap-4"
            onClick={() => handleActions(item)}>
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}
