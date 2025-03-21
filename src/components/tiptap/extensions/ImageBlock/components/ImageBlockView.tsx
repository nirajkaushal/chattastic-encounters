import { useCallback, useRef } from 'react'

import { Node } from '@tiptap/pm/model'
import { Editor, NodeViewWrapper } from '@tiptap/react'

import { cn } from '@/components/tiptap/lib/utils'

interface ImageBlockViewProps {
  editor: Editor
  getPos: () => number
  node: Node
  // updateAttributes: (attrs: Record<string, string>) => void
}

export function ImageBlockView(props: ImageBlockViewProps) {
  const { editor, getPos, node } = props as ImageBlockViewProps & {
    node: Node & {
      attrs: {
        src: string
      }
    }
  }
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const { src } = node.attrs

  const wrapperClassName = cn(
    node.attrs.align === 'left' ? 'ml-0' : 'ml-auto',
    node.attrs.align === 'right' ? 'mr-0' : 'mr-auto',
    node.attrs.align === 'center' && 'mx-auto'
  )

  const onClick = useCallback(() => {
    editor.commands.setNodeSelection(getPos())
  }, [getPos, editor.commands])

  return (
    <NodeViewWrapper>
      <div className={wrapperClassName} style={{ width: node.attrs.width }}>
        <div contentEditable={false} ref={imageWrapperRef}>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
          <img className="block" src={src} alt="" onClick={onClick} />
        </div>
      </div>
    </NodeViewWrapper>
  )
}
// eslint-disable-next-line import/no-default-export
export default ImageBlockView
