
import { AlertCircle } from 'lucide-react'

import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'

export function Live() {
  return (
    <EmptyPlaceholder
      icon={
        <AlertCircle className="w-[60px] h-[60px] text-red-500" />
      }
      title="No Live Content"
      description="No live content available for this frame"
    />
  )
}
