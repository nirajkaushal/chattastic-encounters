import { useEffect } from 'react'

import { useSearch } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'

import { ContentStudio } from './ContentStudio'
import { Header } from './Header'
import { LandingPage } from './LandingPage'
import { Recordings } from './recordings/Recordings'

import { SessionPlanner } from '@/components/event-content/overview-frame/SessionPlanner/SessionPlanner'
import { StudioTabs } from '@/components/event-content/StudioTabs'
import { WithAIChatPanel } from '@/components/event-content/WithAIChatPanel'
import { useStoreSelector } from '@/hooks/useRedux'
import { resetStudioLayoutStateAction } from '@/stores/slices/layout/studio.slice'
import { STUDIO_TABS } from '@/types/event.type'

type StudioLayoutProps = {
  header: React.ReactNode
}

export function StudioLayout({ header }: StudioLayoutProps) {
  const searchParams = useSearch({
    from: '/events/$eventId/',
  }) as {
    modal: boolean
  }
  const activeTab = useStoreSelector((state) => state.layout.studio.activeTab)
  const dispatch = useDispatch()

  useEffect(
    () => () => {
      dispatch(resetStudioLayoutStateAction())
    },
    [dispatch]
  )

  const renderContent = () => {
    if (activeTab === STUDIO_TABS.LANDING_PAGE) {
      return (
        <div className="w-full h-full p-4 bg-transparent rounded-md">
          <WithAIChatPanel>
            <LandingPage />
          </WithAIChatPanel>
        </div>
      )
    }
    if (activeTab === STUDIO_TABS.SESSION_PLANNER) {
      return (
        <div className="w-full h-full p-4 max-w-screen-3xl overflow-y-auto scrollbar-none bg-transparent rounded-md">
          <WithAIChatPanel>
            <SessionPlanner />
          </WithAIChatPanel>
        </div>
      )
    }
    if (activeTab === STUDIO_TABS.CONTENT_STUDIO) {
      return <ContentStudio />
    }

    if (activeTab === STUDIO_TABS.RECORDINGS) {
      return <Recordings />
    }

    return null
  }

  if (activeTab === STUDIO_TABS.CONTENT_STUDIO && searchParams.modal) {
    return <ContentStudio modal />
  }

  return (
    <div className="flex flex-col justify-start items-start w-full h-screen overflow-hidden bg-studio">
      <div className="flex-none w-full sticky top-0 z-50">
        <Header>{header}</Header>
      </div>
      <div className="flex gap-1 items-start w-full flex-auto w-full overflow-hidden">
        <StudioTabs />

        {renderContent()}
      </div>
    </div>
  )
}
