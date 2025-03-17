
import { useCallback } from 'react'

import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import { Text, ChevronDown } from 'lucide-react'

import { DropdownButton } from '@/components/tiptap/ui/Dropdown'

const FONT_SIZES = [
  { key: 'smaller', label: 'Smaller', value: '12px', icon: <Text size={14} /> },
  { key: 'small', label: 'Small', value: '14px', icon: <Text size={14} /> },
  { key: 'medium', label: 'Medium', value: '', icon: <Text size={14} /> },
  { key: 'large', label: 'Large', value: '18px', icon: <Text size={14} /> },
  {
    key: 'extra-large',
    label: 'Extra Large',
    value: '24px',
    icon: <Text size={14} />,
  },
]

export type FontSizePickerProps = {
  onChange: (value: string) => void // eslint-disable-line no-unused-vars
  value: string
}

export function FontSizePicker({ onChange, value }: FontSizePickerProps) {
  const currentValue = FONT_SIZES.find((size) => size.value === value)
  const currentSizeLabel = currentValue?.label.split(' ')[0] || 'Medium'

  const selectSize = useCallback(
    (size: string) => () => onChange(size),
    [onChange]
  )

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button className="h-8 bg-gray-200" endContent={<ChevronDown size={16} />}>
          {currentSizeLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {() => (
          <div>
            {FONT_SIZES.map((size) => (
              <DropdownButton
                isActive={value === size.value}
                onClick={selectSize(size.value)}
                key={`${size.label}_${size.value}`}>
                <span style={{ fontSize: size.value }}>{size.label}</span>
              </DropdownButton>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
