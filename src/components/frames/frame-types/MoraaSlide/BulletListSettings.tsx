/* eslint-disable react/button-has-type */

import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react'

import { BULLET_CHARS, BULLET_TYPES, getBulletChar } from './ListBox'

import { LabelWithInlineControl } from '@/components/common/LabelWithInlineControl'
import { Button } from '@/components/ui/Button'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function BulletListSettings() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject()

  if (!activeObject) return null

  const updateBulletType = (type: string) => {
    const currentBulletType = activeObject.get('bulletType')
    if (currentBulletType === type) return

    const { text } = activeObject

    const updatedText = text
      ?.split('\n')
      .map((line) =>
        BULLET_CHARS.includes(line?.[0])
          ? `${getBulletChar(type)} ${line.slice(2)}`
          : line
      )
      .join('\n')

    canvas.getActiveObject()?.set('text', updatedText)
    canvas.getActiveObject()?.set('bulletType', type)
    canvas.renderAll()
    canvas.fire('object:modified')
  }

  return (
    <LabelWithInlineControl
      label="Bullet Type"
      className="py-2 font-semibold justify-between items-center"
      control={
        <BulletTypeDropdown
          type={activeObject.bulletType!}
          onChange={updateBulletType}
        />
      }
    />
  )
}

function BulletTypeDropdown({
  type,
  onChange,
}: {
  type: string
  onChange: (type: string) => void
}) {
  const items = Object.keys(BULLET_TYPES).map((key) => (
    <Button size="sm" variant="flat" isIconOnly onClick={() => onChange(key)}>
      {BULLET_TYPES[key]}
    </Button>
  ))

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button size="sm" variant="flat" isIconOnly>
          {BULLET_TYPES[type]}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[200px]">
        <div className="px-0 py-1 flex flex-wrap gap-1">{items}</div>
      </PopoverContent>
    </Popover>
  )
}
