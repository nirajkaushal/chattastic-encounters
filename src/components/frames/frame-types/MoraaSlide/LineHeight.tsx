import { LabelWithInlineControl } from '@/components/common/LabelWithInlineControl'
import { NumberInputCaret } from '@/components/common/NumberInputCaret'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function LineHeight() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  return (
    <LabelWithInlineControl
      label="Line Height"
      control={
        <NumberInputCaret
          number={activeObject.lineHeight}
          min={0.1}
          step={0.1}
          onChange={(value: number) => {
            activeObject?.set('lineHeight', Number(value))
            canvas.renderAll()
            canvas.fire('object:modified', { target: activeObject })
          }}
        />
      }
    />
  )
}
