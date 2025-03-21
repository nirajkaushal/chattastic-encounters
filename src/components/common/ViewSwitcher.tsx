
import { Tab, Tabs } from '@heroui/react'
import { Grid, List } from 'lucide-react'

export type ViewTypes = 'grid' | 'list'

export function ViewSwitcher({
  currentView,
  onViewChange,
}: {
  onViewChange: (view: string) => void
  currentView: string
}) {
  return (
    <Tabs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSelectionChange={onViewChange as any}
      selectedKey={currentView}
      size="sm"
      keyboardActivation="manual"
      classNames={{
        tabList: 'p-0 border gap-0 bg-white',
        cursor: 'w-full bg-primary-100 rounded-none',
        tabContent: 'group-data-[selected=true]:text-primary',
        tab: 'p-2.5 data-[focus-visible=true]:outline-0',
      }}>
      <Tab key="grid" title={<Grid size={16} />} />
      <Tab key="list" title={<List size={16} />} />
    </Tabs>
  )
}
