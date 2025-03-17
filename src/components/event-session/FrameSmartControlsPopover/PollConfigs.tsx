
import { useState } from 'react'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react'
import { Settings2, User2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/utils'

export function PollConfigs() {
  const [open, setOpen] = useState(false)

  return (
    <Dropdown offset={10} onOpenChange={setOpen} placement="top">
      <DropdownTrigger>
        <Button
          variant="light"
          className={cn('live-button', {
            active: open,
          })}
          isIconOnly>
          <Settings2 size={18} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          key="multiple-responses"
          startContent={<User2 size={18} />}
          onClick={() => {}}>
          Allow multiple responses
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
