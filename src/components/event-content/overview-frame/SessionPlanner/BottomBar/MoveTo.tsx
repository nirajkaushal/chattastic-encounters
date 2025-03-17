
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Dispatch, SetStateAction, useId, useState } from 'react'

import {
  Select,
  SelectItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react'
import { FolderUp } from 'lucide-react'

import { useEventContext } from '@/contexts/EventContext'
import { useStoreDispatch } from '@/hooks/useRedux'
import { moveFramesThunk } from '@/stores/thunks/frame.thunks'

interface IMoveToSection {
  selectedFrameIds: string[]
  setSelectedFrameIds: Dispatch<SetStateAction<string[]>>
}

export function MoveToSection({
  selectedFrameIds,
  setSelectedFrameIds,
}: IMoveToSection) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string>('')
  const { sections } = useEventContext()
  const dispatch = useStoreDispatch()
  const sectionsId = useId()

  const getSectionsList = () => {
    if (!sections || !sections.length) return []

    return sections.map((section) => ({
      label: section.name,
      value: section.id,
    }))
  }

  const getSectionName = (id: string) => {
    if (!sections || !sections.length) return ''

    return sections.find((section) => section.id === id)?.name || ''
  }

  const moveItems = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selected) {
      return
    }

    dispatch(
      moveFramesThunk({
        frameIds: selectedFrameIds,
        toSectionId: selected,
      })
    )

    setSelectedFrameIds([])
    setOpen(false)
  }

  return (
    <Popover
      placement="bottom"
      showArrow
      offset={20}
      isOpen={open}
      onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger>
        <div className="grid place-items-center h-full py-2 cursor-pointer gap-1">
          <FolderUp size={22} className="hover:text-primary" />
          <p className="text-xs">Move</p>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2 px-2 py-1">
          <p className="text-sm mb-2 font-medium text-center">
            Move to another section
          </p>
          <form onSubmit={moveItems}>
            <Select
              labelPlacement="outside"
              placeholder="Select a section to move to"
              items={getSectionsList()}
              size="sm"
              className="mb-2"
              selectedKeys={selected ? [selected] : []}
              onChange={(e) => setSelected(e.target.value)}>
              {(section) => (
                <SelectItem key={section.value} value={section.value}>
                  {section.label}
                </SelectItem>
              )}
            </Select>
            <p className="text-xs mb-1">
              {!!selected &&
                `${selectedFrameIds.length} ${
                  selectedFrameIds.length === 1 ? 'frame' : 'frames'
                } will be moved to ${getSectionName(selected)}`}
            </p>
            <button
              className="w-full py-2 rounded-md bg-primary text-white"
              type="submit">
              Move
            </button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  )
}
