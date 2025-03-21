
import { AlertCircle } from 'lucide-react'

import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'

type LoadErrorProps = {
  invalidUrl: boolean
  canUpdateFrame: boolean
}

export function LoadError({ invalidUrl, canUpdateFrame }: LoadErrorProps) {
  if (invalidUrl) {
    if (canUpdateFrame) {
      return (
        <EmptyPlaceholder
          icon={
            <AlertCircle className="w-[60px] h-[60px] text-red-500" />
          }
          title="Failed to Load Google Slides"
          description="We encountered an issue while trying to load the Google Slides. Please update the URL to load the content in the preview"
        />
      )
    }
  }

  return (
    <EmptyPlaceholder
      icon={
        <AlertCircle className="w-[60px] h-[60px] text-red-500" />
      }
      title="Failed to Load Google Slides"
      description="We encountered an issue while trying to load the Google Slides. Please try again..."
    />
  )
}
