// eslint-disable-next-line import/no-extraneous-dependencies
import { Placement, Props } from 'tippy.js'

export interface TooltipProps {
  children?: string | React.ReactNode
  enabled?: boolean
  title?: string
  shortcut?: string[]
  tippyOptions?: Omit<Partial<Props>, 'content'>
  content?: React.ReactNode
}

export interface TippyProps {
  'data-placement': Placement
  'data-reference-hidden'?: string
  'data-escaped'?: string
}
