
import { Zap } from 'lucide-react'

export function ActiveBreakoutIndicator() {
  return (
    <div className="flex items-center gap-1 absolute right-1 top-1 bg-green-100 rounded-xl px-1.5 py-0.5 z-10">
      <Zap className="text-green-700" size={16} />
      <span className="text-[12px] text-green-700 font-semibold">Ongoing</span>
    </div>
  )
}
