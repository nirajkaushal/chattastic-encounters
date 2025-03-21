
import { ButtonProps } from '@heroui/button'
import { Settings } from 'lucide-react'

import { ControlButton } from '../common/ControlButton'

type MediaSettingsToggleProps = {
  label?: string
  buttonProps?: ButtonProps
  onClick: () => void
}
export function MediaSettingsToggle({
  label,
  buttonProps = {},
  onClick,
}: MediaSettingsToggleProps) {
  return (
    <ControlButton
      buttonProps={{
        isIconOnly: !label,
        size: 'sm',
        ...buttonProps,
      }}
      tooltipProps={{
        label: 'Setting',
      }}
      onClick={onClick}>
      <Settings size={20} />
      {label}
    </ControlButton>
  )
}
