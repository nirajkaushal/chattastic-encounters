
import { useContext } from 'react'

import { Redo, Undo } from 'lucide-react'

import { HeaderButton } from './HeaderButton'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function HistoryControls({
  hideLabel = false,
  small = false,
}: {
  hideLabel?: boolean
  small?: boolean
}) {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const { canvas } = useMoraaSlideEditorContext()
  const history = useMoraaSlideStore(
    (state) => state.history[currentFrame?.id as string]
  )

  if (!history || !canvas) return null

  return (
    <>
      <HeaderButton
        size={small ? 'sm' : 'lg'}
        tooltipContent="Undo"
        label={!hideLabel ? 'Undo' : ''}
        icon={<Undo size={18} />}
        onClick={() => {
          history.undo()
        }}
      />
      <HeaderButton
        size={small ? 'sm' : 'lg'}
        tooltipContent="Redo"
        label={!hideLabel ? 'Redo' : ''}
        icon={<Redo size={18} />}
        onClick={() => {
          history.redo()
        }}
      />
    </>
  )
}
