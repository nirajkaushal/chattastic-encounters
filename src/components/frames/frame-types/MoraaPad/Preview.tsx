
import { Button } from '@heroui/button'
import { cn } from '@heroui/react'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'

import { Editor } from '../RichText/Editor'

import { FrameTitleDescriptionPreview } from '@/components/common/FrameTitleDescriptionPreview'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Documents } from '@/components/tiptap/Sidebar/Documents'
import { useRichText } from '@/hooks/useRichText'
import { IFrame } from '@/types/frame.type'

type PreviewProps = {
  frame: IFrame
}

export function Preview({ frame }: PreviewProps) {
  const {
    pages,
    showPages,
    activePage,
    toggleShowPages,
    addPage,
    renamePage,
    changeActivePage,
    deletePage,
  } = useRichText(frame.id)

  return (
    <>
      <FrameTitleDescriptionPreview frame={frame} key={frame.id} />
      <div
        className={cn(
          'grid grid-cols-[265px_auto] items-start gap-2 h-full overflow-hidden duration-300',
          {
            'grid-cols-[1fr]': !showPages,
          }
        )}>
        <RenderIf isTrue={showPages}>
          <Documents
            pages={pages}
            activePage={activePage}
            deletePage={deletePage}
            addPage={addPage}
            handlePageChange={changeActivePage}
            renamePage={renamePage}
          />
        </RenderIf>

        <div className="relative w-full h-full duration-300 overflow-auto scrollbar-none bg-white p-6 pt-16">
          <Button
            className="absolute left-4 top-4 z-[51] rounded-lg text-gray-600"
            isIconOnly
            size="sm"
            variant="light"
            onClick={toggleShowPages}>
            {showPages ? (
              <PanelRightClose size={18} />
            ) : (
              <PanelRightOpen size={18} />
            )}
          </Button>
          <Editor
            key={`doc-${activePage}`}
            editorId={activePage}
            editable={false}
            hideSideBar
            enableCollaboration
            classNames={{
              wrapper: 'overflow-hidden w-full',
              container: 'flex flex-col overflow-hidden',
            }}
          />
        </div>
      </div>
    </>
  )
}
