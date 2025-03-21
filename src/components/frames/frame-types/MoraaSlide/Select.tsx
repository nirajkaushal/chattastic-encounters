
import { MousePointer } from 'lucide-react'

import { HeaderButton } from './HeaderButton'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function Select() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const handleSelect = () => {
    canvas.isDrawingMode = false
    canvas.selection = true
  }

  return (
    <HeaderButton
      tooltipContent="Select"
      label="Select"
      active={canvas.selection}
      icon={<MousePointer size={18} />}
      onClick={handleSelect}
    />
  )
}
