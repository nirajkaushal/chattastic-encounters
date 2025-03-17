
/* eslint-disable react/button-has-type */
import toast, { type Toast } from 'react-hot-toast'
import { Timer } from 'lucide-react'

import { CustomToast } from './CustomToast'

type TimerEndedToastProps = {
  t: Toast
}

export function TimerEndedToast({ t }: TimerEndedToastProps) {
  return (
    <CustomToast
      visible={t.visible}
      icon={<Timer size={44} color="red" />}
      title="Time Ended"
      message="Your time is up!"
      onClose={() => toast.dismiss(t.id)}
    />
  )
}
