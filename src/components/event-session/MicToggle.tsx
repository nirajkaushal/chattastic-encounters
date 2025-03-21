
import { useDyteSelector } from '@dytesdk/react-web-core'
import { useHotkeys } from 'react-hotkeys-hook'
import { Mic, MicOff } from 'lucide-react'

import { ControlButton } from '../common/ControlButton'

import { useDetectSpeaking } from '@/hooks/useDetectSpeaking'
import { useUserPreferences } from '@/hooks/userPreferences'
import { cn, KeyboardShortcuts, liveHotKeyProps } from '@/utils/utils'

export function MicToggle({
  className = '',
  hideSpeakingAlert = false,
}: {
  className?: string
  hideSpeakingAlert?: boolean
}) {
  const { userPreferencesMeetingAudio } = useUserPreferences()
  const self = useDyteSelector((state) => state.self)
  const isMicEnabled = useDyteSelector((state) => state.self?.audioEnabled)
  const { isSpeaking } = useDetectSpeaking({
    detect: !isMicEnabled && !hideSpeakingAlert,
  })

  const handleMic = () => {
    if (isMicEnabled) {
      self.disableAudio()
      userPreferencesMeetingAudio(false)

      return
    }

    self.enableAudio()
    userPreferencesMeetingAudio(true)
  }

  useHotkeys(
    KeyboardShortcuts.Live.muteUnmute.key,
    handleMic,
    [self, isMicEnabled],
    liveHotKeyProps
  )

  const getTooltipProps = () => {
    if (isSpeaking) {
      return {
        label: (
          <p>
            You&apos;re on mute! <br /> Click the mic button or <br /> use the
            shortcut to unmute.
          </p>
        ),
        actionKey: KeyboardShortcuts.Live.muteUnmute.key,
        isOpen: true,
      }
    }

    return {
      label: KeyboardShortcuts.Live.muteUnmute.label,
      actionKey: KeyboardShortcuts.Live.muteUnmute.key,
    }
  }

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        size: 'sm',
        radius: 'md',
        variant: 'flat',
        className: cn('live-button', className, {
          '!text-red-500 hover:!text-red-500': !isMicEnabled,
        }),
        disableAnimation: true,
        disableRipple: true,
      }}
      tooltipProps={getTooltipProps()}
      onClick={handleMic}>
      {isMicEnabled ? <Mic size={18} /> : <MicOff size={18} />}
    </ControlButton>
  )
}
