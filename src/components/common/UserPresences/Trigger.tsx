
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar } from '@heroui/react'
import { ChevronDown } from 'lucide-react'

export function Trigger({
  avatar,
  totalPresences,
}: {
  avatar: string
  totalPresences: number
}) {
  return (
    <div className="flex justify-center items-center gap-1 pr-2 bg-gray-100 rounded-full">
      <Avatar size="sm" src={avatar} className="border-2 border-primary-300" />
      <span className="w-3 text-center">{totalPresences || 1}</span>
      <div className="flex justify-center items-center">
        <ChevronDown size={16} strokeWidth={2} />
      </div>
    </div>
  )
}
