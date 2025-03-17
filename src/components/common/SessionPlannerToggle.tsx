
import { useHotkeys } from 'react-hotkeys-hook'
import { Table } from 'lucide-react'

import { ControlButton } from './ControlButton'

import { cn, KeyboardShortcuts, liveHotKeyProps } from '@/utils/utils'

export function SessionPlannerToggle() {
  const handleToggle = () => {
    // show session planner
  }

  useHotkeys('p', handleToggle, liveHotKeyProps)

  const isSessionPlannerOpen = false

  return (
    <ControlButton
      buttonProps={{
        size: 'sm',
        variant: 'light',
        isIconOnly: true,
        disableRipple: true,
        disableAnimation: true,
        className: cn('live-button', {
          active: isSessionPlannerOpen,
        }),
        startContent: (
          <Table
            size={20}
            className={cn({
              'text-primary': isSessionPlannerOpen,
            })}
          />
        ),
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.chats.label,
        actionKey: KeyboardShortcuts.Live.chats.key,
      }}
      onClick={handleToggle}
    />
  )
}
