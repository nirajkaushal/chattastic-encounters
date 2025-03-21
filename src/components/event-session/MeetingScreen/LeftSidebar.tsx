import { useEffect } from 'react'

import { motion } from 'framer-motion'

import { AgendaPanel } from '@/components/common/AgendaPanel'
import { LiveAgendaHeader } from '@/components/common/AgendaPanel/LiveAgendaHeader'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import {
  ContentTilesLayout,
  maximizeLeftSidebarAction,
  minimizeLeftSidebarAction,
} from '@/stores/slices/layout/live.slice'
import { cn } from '@/utils/utils'

export function LeftSidebar() {
  const { permissions } = useEventPermissions()
  const { leftSidebarMode } = useStoreSelector((state) => state.layout.live)
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )
  const dispatch = useStoreDispatch()
  const layout = useStoreSelector(
    (state) => state.layout.live.contentTilesLayoutConfig.layout
  )

  useEffect(() => {
    if (layout === ContentTilesLayout.Spotlight) {
      dispatch(minimizeLeftSidebarAction())
    } else if (permissions.canAcessAllSessionControls) {
      dispatch(maximizeLeftSidebarAction())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout])

  if (!permissions.canAcessAllSessionControls || isInBreakoutMeeting) {
    return null
  }

  return (
    <motion.div
      initial={{ marginLeft: -224 }}
      animate={{
        marginLeft: leftSidebarMode === 'maximized' ? 16 : -224,
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'relative w-56 h-full ml-4 rounded-md overflow-hidden bg-white border-1 border-gray-200'
      )}>
      <AgendaPanel header={<LiveAgendaHeader />} />
    </motion.div>
  )
}
