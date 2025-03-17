
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { CircleStop, Record } from 'lucide-react'

import { ControlButton } from '../common/ControlButton'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useFlags } from '@/flags/client'
import { cn } from '@/utils/utils'

export function MeetingRecordingButton() {
  const { meeting } = useDyteMeeting()
  const { flags } = useFlags()
  const { isHost } = useEventSession()
  const recordingState = useDyteSelector(
    (meet) => meet.recording.recordingState
  )
  const isRecording = recordingState === 'RECORDING'

  const onRecordingToggle = () => {
    if (isRecording) {
      meeting.recording.stop()
    } else {
      meeting.recording.start()
    }
  }

  if (!isHost) return null

  if (!flags?.show_recording_button) return null

  return (
    <ControlButton
      tooltipProps={{
        content: isRecording ? 'Stop Recording' : 'Start Recording',
        actionKey: 'R',
      }}
      buttonProps={{
        size: 'sm',
        radius: 'md',
        variant: 'flat',
        color: isRecording ? 'danger' : 'default',
        startContent: isRecording ? (
          <CircleStop size={18} />
        ) : (
          <Record size={18} />
        ),
        className: cn('', {
          active: isRecording,
        }),
      }}
      onClick={onRecordingToggle}>
      <span className="mb-0.5">{isRecording ? 'Recording' : 'Record'}</span>
    </ControlButton>
  )
}
