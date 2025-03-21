
import { Button } from '@heroui/react'
import { fabric } from 'fabric'
import { Group, Ungroup } from 'lucide-react'

export function GroupBubbleMenu({ canvas }: { canvas: fabric.Canvas }) {
  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  return (
    <div className="flex justify-start items-center gap-1">
      <Button
        size="sm"
        variant="light"
        isIconOnly
        className="h-7 text-sm flex justify-center items-center gap-1 px-1"
        onClick={() => {
          activeObject.setOnGroup()
          canvas.renderAll()
          canvas.fire('object:modified', { target: activeObject })
        }}>
        <Group size={16} />
      </Button>
      <Button
        size="sm"
        variant="light"
        isIconOnly
        className="h-7 text-sm flex justify-center items-center gap-1 px-1"
        onClick={() => {
          activeObject.set(
            'fontStyle',
            activeObject.fontStyle === 'italic' ? 'normal' : 'italic'
          )
          canvas.renderAll()
          canvas.fire('object:modified', { target: activeObject })
        }}>
        <Ungroup size={16} />
      </Button>
    </div>
  )
}
