
import { useEffect, useState } from 'react'

import { Input } from '@heroui/react'
import { useDebounce } from '@uidotdev/usehooks'
import { Search } from 'lucide-react'

type SearchInputProps = {
  placeholder?: string
  debounce?: number
  onChange?: (value: string) => void
}

export function SearchInput({
  placeholder = 'Search',
  debounce = 300,
  onChange,
}: SearchInputProps) {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, debounce)

  useEffect(() => {
    onChange?.(debouncedValue)
  }, [debouncedValue, onChange])

  return (
    <Input
      placeholder={placeholder}
      labelPlacement="outside"
      fullWidth
      radius="sm"
      className="shadow-none"
      variant="bordered"
      startContent={
        <Search className="text-2xl text-primary-200 pointer-events-none flex-shrink-0" />
      }
      onChange={(e) => {
        setValue(e.target.value)
      }}
    />
  )
}
