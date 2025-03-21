import { Checkbox } from '@heroui/react'

import { PollFrame, PollOption } from '@/types/frame.type'

interface PollOptionProps {
  frame: PollFrame
  voted?: boolean
  pollOption: PollOption
  canVote?: boolean
  isOptionSelected: (option: string) => boolean
  handleVoteCheckbox: (option: string) => void
}

export function PollBar({
  frame,
  pollOption,
  voted,
  canVote = true,
  isOptionSelected,
  handleVoteCheckbox,
}: PollOptionProps) {
  if (frame.config.allowVoteOnMultipleOptions && canVote && !voted) {
    return (
      <Checkbox
        isSelected={isOptionSelected(pollOption.id)}
        onValueChange={() => handleVoteCheckbox(pollOption.id)}
        radius="sm"
        classNames={{
          label: 'font-bold text-black',
        }}>
        {pollOption.name}
      </Checkbox>
    )
  }

  return <p className="font-bold">{pollOption.name}</p>
}
