
import { useHotkeys } from 'react-hotkeys-hook'
import { MessageSquare } from 'lucide-react'

import { ControlButton } from '../common/ControlButton'

import { cn, KeyboardShortcuts, liveHotKeyProps } from '@/utils/utils'

export function NotesToggle({
  isNotesSidebarOpen,
  onClick,
}: {
  isNotesSidebarOpen: boolean
  onClick: () => void
}) {
  const handleShortCut = () => {
    onClick()
  }
  useHotkeys('n', handleShortCut, liveHotKeyProps)

  return (
    <ControlButton
      buttonProps={{
        size: 'md',
        variant: 'light',
        disableRipple: true,
        disableAnimation: true,
        className: cn('live-button', {
          active: isNotesSidebarOpen,
        }),
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.notes.label,
        actionKey: KeyboardShortcuts.Live.notes.key,
      }}
      onClick={onClick}>
      <div className="flex flex-col justify-center items-center py-1">
        <MessageSquare size={20} />
        Note
      </div>
    </ControlButton>
  )
}
