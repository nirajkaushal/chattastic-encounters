import { DyteAudioVisualizer } from '@dytesdk/react-ui-kit'
import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'
import { FaUserShield } from 'react-icons/fa'

import { RenderIf } from '../common/RenderIf/RenderIf'

import { cn } from '@/utils/utils'

export function ParticipantTagName({
  participant,
  isHost,
  classNames = {},
}: {
  participant: DyteParticipant | Readonly<DyteSelf>
  isHost: boolean
  classNames?: {
    container?: string
  }
}) {
  const { name, audioEnabled } = participant

  return (
    <div
      className={cn(
        'absolute bottom-2 left-2 max-w-56 w-fit flex justify-start items-center',
        classNames.container
      )}>
      <RenderIf isTrue={audioEnabled}>
        <DyteAudioVisualizer participant={participant} variant="bars" />
      </RenderIf>
      <div className="flex justify-start items-center gap-1 w-full">
        <div className="shrink-0 w-full line-clamp-1 flex-nowrap h-6 p-1 text-white text-left">
          {name}
        </div>
        <RenderIf isTrue={isHost}>
          <FaUserShield size={16} className="text-white" title="Host" />
        </RenderIf>
      </div>
    </div>
  )
}
