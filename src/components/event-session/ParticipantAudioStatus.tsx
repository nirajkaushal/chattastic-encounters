
import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'
import { Mic, MicOff } from 'lucide-react'

import { RenderIf } from '../common/RenderIf/RenderIf'

import { cn } from '@/utils/utils'

export function ParticipantAudioStatus({
  participant,
  isTileSmall,
}: {
  participant: DyteParticipant | Readonly<DyteSelf>
  isTileSmall?: boolean
}) {
  const muted = !participant.audioEnabled

  return (
    <div
      className={cn(
        'absolute top-2 left-2 rounded-full bg-black/50 text-white flex justify-center items-center',
        {
          'w-6 h-6 p-1': isTileSmall,
          'w-8 h-8 p-2': !isTileSmall,
          hidden: !muted,
        }
      )}>
      <RenderIf isTrue={muted}>
        <MicOff size={20} />
      </RenderIf>
      <RenderIf isTrue={!muted}>
        <Mic size={20} />
      </RenderIf>
    </div>
  )
}
