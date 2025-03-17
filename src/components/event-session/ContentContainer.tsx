import { useCallback, useEffect, useRef, useState } from 'react'

import { DytePluginMain, DyteScreenshareView } from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { Tabs, Tab } from '@heroui/react'
import { X } from 'lucide-react'

import { ParticipantTagName } from './ParticipantTagName'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { SectionOverview } from '../common/SectionOverview'
import { Frame } from '../frames/Frame/Frame'
import { Button } from '../ui/Button'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreSelector } from '@/hooks/useRedux'
import { PresentationStatuses } from '@/types/event-session.type'

enum TabKeys {
  FRAME = 'Frame',
  SCREENSHARE = 'Screenshare',
  PLUGIN = 'Plugin',
}

type Tab = {
  key: TabKeys
  title: TabKeys
  content: React.ReactNode
}

const tabs: Tab[] = [
  {
    key: TabKeys.FRAME,
    title: TabKeys.FRAME,
    content: <FrameTabContent />,
  },
  {
    key: TabKeys.SCREENSHARE,
    title: TabKeys.SCREENSHARE,
    content: <ScreenshareTabContent />,
  },
  {
    key: TabKeys.PLUGIN,
    title: TabKeys.PLUGIN,
    content: <PluginTabContent />,
  },
]

export function ContentContainer() {
  const [activeTab, setActiveTab] = useState(TabKeys.FRAME)
  const { currentFrame } = useEventSession()
  const { permissions } = useEventPermissions()
  const selfParticipant = useDyteSelector((m) => m.self)
  const selfScreenShared = useDyteSelector((m) => m.self.screenShareEnabled)
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )
  const activePlugins = useDyteSelector((m) => m.plugins.active.toArray())

  useEffect(() => {
    if (currentFrame?.id) {
      setActiveTab(TabKeys.FRAME)
    }
  }, [currentFrame?.id])

  const getTabs = useCallback(() => {
    const _tabs = []
    if (currentFrame?.id) {
      _tabs.push(tabs[0])
    }
    if (selfScreenShared || screensharingParticipant) {
      _tabs.push(tabs[1])
    }
    if (activePlugins.length > 0) {
      _tabs.push(tabs[2])
    }

    return _tabs
  }, [
    activePlugins.length,
    currentFrame?.id,
    screensharingParticipant,
    selfScreenShared,
  ])

  const handleCloseTab = useCallback(
    (key: string) => {
      if (key === TabKeys.SCREENSHARE) {
        // Stop screenshare
        if (selfScreenShared) {
          selfParticipant.disableScreenShare()
        }
        if (screensharingParticipant?.screenShareEnabled) {
          screensharingParticipant.setScreenShareEnabled(false)
        }
      }
    },
    [selfParticipant, screensharingParticipant, selfScreenShared]
  )

  const currentTabs = getTabs()

  return (
    <div className="relative h-full flex flex-col">
      <Tabs
        items={getTabs()}
        selectedKey={activeTab}
        onSelectionChange={(value) => setActiveTab(value as TabKeys)}
        classNames={{
          tabList: currentTabs.length > 1 ? 'flex border-1' : 'hidden',
          tabContent: 'px-2 py-0 border-0',
        }}
        size="md"
        color="secondary"
        variant="bordered">
        {(item) => (
          <Tab
            key={item.key}
            title={
              <TabTitle
                title={item.title}
                closable={
                  item.key !== TabKeys.FRAME &&
                  permissions.canAcessAllSessionControls
                }
                onClose={() => {
                  handleCloseTab(item.key as TabKeys)
                }}
              />
            }
            className="flex-auto px-0">
            {item.content}
          </Tab>
        )}
      </Tabs>
    </div>
  )
}

function TabTitle({
  title,
  closable = false,
  onClose,
}: {
  title: string
  closable?: boolean
  onClose: () => void
}) {
  return (
    <div className="flex items-center space-x-2">
      <span>{title}</span>
      <RenderIf isTrue={closable}>
        <X
          className="w-4 h-4 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        />
      </RenderIf>
    </div>
  )
}

function FrameTabContent() {
  const { currentFrame, presentationStatus, isHost } = useEventSession()
  const currentSectionId = useStoreSelector(
    (state) => state.event.currentEvent.eventState.currentSectionId
  )

  return (
    <div className="h-full w-full">
      {presentationStatus === PresentationStatuses.STOPPED &&
      !isHost ? null : currentSectionId ? (
        <SectionOverview />
      ) : currentFrame ? (
        <Frame key={currentFrame?.id} frame={currentFrame} />
      ) : null}
    </div>
  )
}

function ScreenshareTabContent() {
  const dyteScreenshareViewRef = useRef<HTMLDyteScreenshareViewElement>(null)
  const { permissions } = useEventPermissions()
  const { meeting } = useDyteMeeting()
  const selfParticipant = useDyteSelector((m) => m.self)
  const selfScreenShared = useDyteSelector((m) => m.self.screenShareEnabled)
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )
  const isParticipantScreenShared =
    !!screensharingParticipant?.screenShareEnabled

  useEffect(() => {
    if (!dyteScreenshareViewRef.current) return
    setTimeout(() => {
      dyteScreenshareViewRef.current?.shadowRoot
        ?.querySelector('div#video-container')
        ?.setAttribute(
          'style',
          'position: absolute !important; width: 100% !important; max-width: 100% !important;'
        )
    }, 2000)
  }, [dyteScreenshareViewRef, screensharingParticipant, selfScreenShared])

  const handleClose = useCallback(() => {
    if (selfScreenShared) {
      selfParticipant.disableScreenShare()
    }
    if (screensharingParticipant?.screenShareEnabled) {
      screensharingParticipant.setScreenShareEnabled(false)
    }
  }, [screensharingParticipant, selfParticipant, selfScreenShared])

  return (
    <div className="h-full w-full relative">
      {isParticipantScreenShared && (
        <DyteScreenshareView
          ref={dyteScreenshareViewRef}
          meeting={meeting}
          participant={screensharingParticipant}>
          <ParticipantTagName
            isHost={false}
            participant={screensharingParticipant}
          />
        </DyteScreenshareView>
      )}
      {selfScreenShared && (
        <DyteScreenshareView
          ref={dyteScreenshareViewRef}
          meeting={meeting}
          participant={selfParticipant}>
          <ParticipantTagName
            isHost={false}
            participant={selfParticipant}
            classNames={{
              container: 'bg-black bg-opacity-50 h-7 rounded-md px-2',
            }}
          />
        </DyteScreenshareView>
      )}
      <RenderIf isTrue={!isParticipantScreenShared && !selfScreenShared}>
        <div className="flex items-center justify-center h-full w-full">
          <span className="text-gray-500">No screenshare available</span>
        </div>
      </RenderIf>
      <RenderIf
        isTrue={
          permissions.canAcessAllSessionControls &&
          (isParticipantScreenShared || selfScreenShared)
        }>
        <div className="absolute bottom-2 right-2">
          <Button size="sm" color="danger" onPress={handleClose}>
            Stop screenshare
          </Button>
        </div>
      </RenderIf>
    </div>
  )
}

function PluginTabContent() {
  const { meeting } = useDyteMeeting()
  const activePlugins = useDyteSelector((m) => m.plugins.active.toArray())
  const recentActivePlugin = activePlugins?.[activePlugins.length - 1]

  return (
    <div className="h-full w-full">
      {recentActivePlugin && (
        <div className="relative h-full w-full">
          <div className="absolute right-0 top-0 w-8 h-8 rounded-full bg-[#f5f5f5]" />
          <DytePluginMain meeting={meeting} plugin={recentActivePlugin} />
        </div>
      )}
    </div>
  )
}
