
import { useState } from 'react'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/react'
import { LayoutSidebar } from 'lucide-react'
import { LayoutDashboard } from 'lucide-react'
import { Settings } from 'lucide-react'
import { LayoutGrid } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useUserPreferences } from '@/hooks/userPreferences'
import {
  changeContentTilesLayoutConfigAction,
  ContentTilesLayout,
  openChangeContentTilesLayoutModalAction,
} from '@/stores/slices/layout/live.slice'
import { cn } from '@/utils/utils'

export function ContentTilesLayoutDropdown({
  showLabel,
}: {
  showLabel?: boolean
}) {
  const [open, setOpen] = useState(false)
  const dispatch = useStoreDispatch()
  const layout = useStoreSelector(
    (store) => store.layout.live.contentTilesLayoutConfig.layout
  )
  const { userPreferencesMeetingLayout } = useUserPreferences()

  return (
    <Dropdown offset={20} showArrow onOpenChange={setOpen}>
      <DropdownTrigger>
        <Button
          size="sm"
          isIconOnly={!showLabel}
          className={cn('live-button', {
            active: open,
          })}
          startContent={<LayoutDashboard size={16} />}
          variant="light">
          {showLabel ? 'Layout' : null}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dropdown menu with description" variant="faded">
        <DropdownSection showDivider title="Change Layout">
          <DropdownItem
            key="spotlight"
            description="Tiles will overlay the frame"
            // shortcut="⌘N"
            startContent={<LayoutGrid size={48} />}
            className={cn('mb-2', {
              'bg-primary-100 border-primary-200':
                layout === ContentTilesLayout.Spotlight,
            })}
            onPress={() => {
              dispatch(
                changeContentTilesLayoutConfigAction({
                  layout: ContentTilesLayout.Spotlight,
                })
              )
              userPreferencesMeetingLayout(ContentTilesLayout.Spotlight)
            }}>
            Spotlight
          </DropdownItem>
          <DropdownItem
            key="sidebar"
            description="Tiles will be displayed on the sidebar"
            // shortcut="⌘C"
            startContent={<LayoutSidebar size={48} />}
            className={cn('mb-2', {
              'bg-primary-100 border-primary-200':
                layout === ContentTilesLayout.Sidebar ||
                layout === ContentTilesLayout.Default,
            })}
            onPress={() => {
              dispatch(
                changeContentTilesLayoutConfigAction({
                  layout: ContentTilesLayout.Sidebar,
                })
              )
              userPreferencesMeetingLayout(ContentTilesLayout.Sidebar)
            }}>
            Sidebar
          </DropdownItem>
          <DropdownItem
            key="topbar"
            description="Tiles will be displayed on the topbar"
            // shortcut="⌘⇧E"
            startContent={
              <LayoutSidebar className="-rotate-90" size={48} />
            }
            className={cn({
              'bg-primary-100 border-primary-200':
                layout === ContentTilesLayout.Topbar,
            })}
            onPress={() => {
              dispatch(
                changeContentTilesLayoutConfigAction({
                  layout: ContentTilesLayout.Topbar,
                })
              )
              userPreferencesMeetingLayout(ContentTilesLayout.Topbar)
            }}>
            Topbar
          </DropdownItem>
        </DropdownSection>
        <DropdownSection>
          <DropdownItem
            key="open-modal"
            description="You can change more options"
            // shortcut="⌘⇧D"
            startContent={<Settings size={48} />}
            onPress={() => {
              dispatch(openChangeContentTilesLayoutModalAction())
            }}>
            More Options
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
