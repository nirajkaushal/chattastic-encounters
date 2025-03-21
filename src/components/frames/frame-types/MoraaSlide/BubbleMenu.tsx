import { useEffect, useState } from 'react'

import { fabric } from 'fabric'

import { GroupBubbleMenu } from './GroupBubbleMenu'
import { ImageBubbleMenu } from './ImageBubbleMenu'
import { ListBubbleMenu } from './ListBubbleMenu'
import { RectBubbleMenu } from './RectBubbleMenu'
import { TextboxBubbleMenu } from './TextboxBubbleMenu'

enum FabricObjectType {
  TEXTBOX = 'textbox',
  RECT = 'rect',
  CIRCLE = 'circle',
  POLYGON = 'polygon',
  IMAGE = 'image',
  PATH = 'path',
  GROUP = 'group',
  ACTIVE_SELECTION = 'activeSelection',
  BULLET_LIST = 'BulletList',
  NUMBER_LIST = 'NumberList',
}

const calculateBubbleMenuPosition = (target: fabric.Object) => {
  const boundingBox = target.getBoundingRect()

  // 1. Both are negative
  if (boundingBox.left < 0 && boundingBox.top < 0) {
    return {
      left: 5,
      top: 5,
    }
  }

  // 2. Both are positive
  if (boundingBox.left > 0 && boundingBox.top > 0) {
    return {
      left: boundingBox.left || 5,
      top: boundingBox.top || 5,
    }
  }

  // 3. left is negative and top is positive
  if (boundingBox.left < 0 && boundingBox.top > 0) {
    return {
      left: 5,
      top: boundingBox.top || 5,
    }
  }

  // 4. left is positive and top is negative
  if (boundingBox.left > 0 && boundingBox.top < 0) {
    return {
      left: boundingBox.left || 5,
      top: 5,
    }
  }

  return {
    left: 5,
    top: 5,
  }
}

export function BubbleMenu({ canvas }: { canvas: fabric.Canvas }) {
  const [objectMoving, setObjectMoving] = useState<boolean>(false)
  const [bubbleMenuOptions, setBubbleMenuOptions] = useState<{
    left: number
    top: number
    visible: boolean
    type: string
  } | null>(null)

  useEffect(() => {
    if (!canvas) return

    canvas.on('selection:created', () => {
      const activeObject = canvas.getActiveObject()
      if (activeObject) {
        setBubbleMenuOptions({
          left: calculateBubbleMenuPosition(activeObject).left,
          top: calculateBubbleMenuPosition(activeObject).top,
          visible: true,
          type: activeObject.type!,
        })
      } else {
        setBubbleMenuOptions(null)
      }
    })

    canvas.on('selection:updated', () => {
      const activeObject = canvas.getActiveObject()
      if (activeObject) {
        setBubbleMenuOptions({
          left: calculateBubbleMenuPosition(activeObject).left,
          top: calculateBubbleMenuPosition(activeObject).top,
          visible: true,
          type: activeObject.type!,
        })
      } else {
        setBubbleMenuOptions(null)
      }
    })

    canvas.on('object:moving', () => {
      const activeObject = canvas.getActiveObject()
      if (activeObject) {
        setBubbleMenuOptions({
          left: calculateBubbleMenuPosition(activeObject).left,
          top: calculateBubbleMenuPosition(activeObject).top,
          visible: true,
          type: activeObject.type!,
        })
      } else {
        setBubbleMenuOptions(null)
      }
      setObjectMoving(true)
    })

    canvas.on('object:modified', () => {
      setObjectMoving(false)
    })

    canvas.on('selection:cleared', () => {
      setBubbleMenuOptions(null)
    })

    // eslint-disable-next-line consistent-return
    return () => {
      canvas?.off('selection:created')
      canvas?.off('selection:updated')
      canvas?.off('object:moving')
      canvas?.off('selection:cleared')
    }
  }, [canvas])

  const renderersByObjectType: Record<FabricObjectType, React.ReactNode> = {
    [FabricObjectType.TEXTBOX]: <TextboxBubbleMenu canvas={canvas} />,
    [FabricObjectType.RECT]: <RectBubbleMenu canvas={canvas} />,
    [FabricObjectType.CIRCLE]: <RectBubbleMenu canvas={canvas} />,
    [FabricObjectType.POLYGON]: <RectBubbleMenu canvas={canvas} />,
    [FabricObjectType.IMAGE]: <ImageBubbleMenu canvas={canvas} />,
    [FabricObjectType.PATH]: <RectBubbleMenu canvas={canvas} />,
    [FabricObjectType.GROUP]: <GroupBubbleMenu canvas={canvas} />,
    [FabricObjectType.BULLET_LIST]: <ListBubbleMenu canvas={canvas} />,
    [FabricObjectType.NUMBER_LIST]: <ListBubbleMenu canvas={canvas} />,
    [FabricObjectType.ACTIVE_SELECTION]: null,
  }

  if (!bubbleMenuOptions) return null

  const renderer =
    renderersByObjectType[bubbleMenuOptions.type as FabricObjectType]

  if (!renderer) return null

  return (
    <div
      className="absolute p-1 bg-white rounded-md shadow-sm min-w-11 border-1 border-primary-100"
      style={{
        left: bubbleMenuOptions?.left,
        top: bubbleMenuOptions?.top > 60 ? bubbleMenuOptions.top - 60 : 5,
        display: bubbleMenuOptions?.visible ? 'block' : 'none',
        opacity: objectMoving ? 0.5 : 1,
      }}>
      {renderer}
    </div>
  )
}
