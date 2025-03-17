
import { EyeOff } from 'lucide-react'

import { EmptyPlaceholder } from './EmptyPlaceholder'

export function NoFramePreview() {
  return (
    <EmptyPlaceholder
      icon={<EyeOff size={96} />}
      title="Oops, preview not available"
      description="Frame preview not available for this frame"
      classNames={{
        icon: 'text-gray-600',
        title: 'text-gray-600',
        description: 'text-gray-400',
      }}
    />
  )
}
