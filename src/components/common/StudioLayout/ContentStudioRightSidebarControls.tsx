import { Tabs, Tab, Divider } from '@heroui/react'
import { useHotkeys } from 'react-hotkeys-hook'

import { FrameAppearanceToggleButton } from './FrameAppearanceToggleButton'
import { FrameNoteToggleButton } from './FrameNoteToggleButton'
import { FrameSettingsToggleButton } from './FrameSettingsToggleButton'
import { ContentTypeIcon } from '../ContentTypeIcon'
import { RenderIf } from '../RenderIf/RenderIf'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setContentStudioRightSidebarAction } from '@/stores/slices/layout/studio.slice'
import { FrameType } from '@/utils/frame-picker.util'

export function ContentStudioRightSidebarControls() {
  const dispatch = useStoreDispatch()
  const { eventMode, currentFrame } = useEventContext()
  const { permissions } = useEventPermissions()

  const { contentStudioRightSidebar } = useStoreSelector(
    (state) => state.layout.studio
  )

  useHotkeys(
    ']',
    () => dispatch(setContentStudioRightSidebarAction(null)),
    {
      enableOnFormTags: ['INPUT', 'TEXTAREA'],
    },
    []
  )

  if (!permissions.canUpdateFrame && eventMode !== 'edit') {
    return null
  }

  const renderContent = () => {
    if (!currentFrame) return []

    if ([FrameType.MORAA_SLIDE].includes(currentFrame.type as FrameType)) {
      return [
        {
          key: 'frame-settings',
          title: 'Settings',
          content: <FrameSettingsToggleButton />,
        },
        {
          key: 'frame-appearance',
          title: 'Appearance',
          content: <FrameAppearanceToggleButton />,
        },
        {
          key: 'frame-notes',
          title: 'Notes',
          content: <FrameNoteToggleButton />,
        },
      ]
    }

    return [
      {
        key: 'frame-settings',
        title: 'Settings',
        content: <FrameSettingsToggleButton />,
      },
      {
        key: 'frame-notes',
        title: 'Notes',
        content: <FrameNoteToggleButton />,
      },
    ]
  }

  const tabsContent = renderContent()
  if (tabsContent.length === 0) return null

  return (
    <div className="p-4 pb-0">
      <RenderIf isTrue={!!currentFrame?.type}>
        <p className="flex items-center gap-2 text-gray-400 text-sm">
          <ContentTypeIcon frameType={currentFrame?.type as FrameType} />
          {currentFrame?.type}
        </p>
      </RenderIf>

      <Tabs
        size="sm"
        key="underlined"
        keyboardActivation="manual"
        aria-label="Sidebar Tabs"
        variant="underlined"
        selectedKey={contentStudioRightSidebar}
        onSelectionChange={(key) =>
          dispatch(setContentStudioRightSidebarAction(key))
        }
        classNames={{
          tabList: 'gap-6 w-full relative rounded-none p-0',
          cursor: 'w-full bg-primary',
          tab: 'max-w-fit font-medium px-0 h-10 pt-0 data-[focus-visible=true]:outline-0',
          tabContent: 'group-data-[selected=true]:text-primary',
          base: 'mt-1',
        }}>
        {tabsContent.map((tab) => (
          <Tab key={tab.key} title={tab.title} />
        ))}
      </Tabs>
      <Divider className="-mt-[1px] mb-0 w-[90%]" />
    </div>
  )
}
