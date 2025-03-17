
import { Button } from '@heroui/react'
import { MoreHorizontal } from 'lucide-react'

import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setContentStudioRightSidebarAction } from '@/stores/slices/layout/studio.slice'

export function BubbleMenuMoreOptions() {
  const { contentStudioRightSidebar } = useStoreSelector(
    (store) => store.layout.studio
  )
  const dispatch = useStoreDispatch()

  return (
    <Button
      size="sm"
      variant="light"
      isIconOnly
      radius="md"
      className="h-7 text-sm flex justify-center items-center gap-1 px-1"
      onClick={() => {
        if (contentStudioRightSidebar === 'frame-appearance') {
          dispatch(setContentStudioRightSidebarAction(null))

          return
        }

        dispatch(setContentStudioRightSidebarAction('frame-appearance'))
      }}>
      <MoreHorizontal size={16} />
    </Button>
  )
}
