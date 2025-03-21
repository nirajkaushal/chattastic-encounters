/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { ListViewToggle } from './ListViewToggle'

import { ContentStudioModalWithTrigger } from '@/components/event-session/ContentStudioModalWithTrigger'
import { useStoreSelector } from '@/hooks/useRedux'
import { cn } from '@/utils/utils'

export const HEADER_HEIGHT = 72
export const HEADER_HEIGHT_WHEN_MINIMIZED = 36

export function LiveAgendaHeader() {
  const { leftSidebarMode } = useStoreSelector((state) => state.layout.live)

  const isMaximized = leftSidebarMode === 'maximized'

  const height = isMaximized ? `${HEADER_HEIGHT}px` : 'auto'

  return (
    <div
      style={{
        height,
      }}>
      <div
        className={cn('flex', {
          'flex-col gap-2': isMaximized,
          'flex-row gap-2': !isMaximized,
        })}>
        <div className="flex items-center justify-between gap-2">
          {isMaximized && <span className="font-medium">Agenda</span>}
          <div className={cn('flex justify-end items-center gap-2')}>
            {isMaximized && <ListViewToggle />}
          </div>
        </div>
        <div>
          <ContentStudioModalWithTrigger />
        </div>
      </div>
    </div>
  )
}
