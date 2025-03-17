import {
  ContentTilesLayout,
  MaxTilesPerPage,
} from '@/stores/slices/layout/live.slice'

export type PostfixKeysWith<T extends object, Key extends string> = {
  [K in keyof T as `${string & K}${Key}`]: T[K]
}

export type UserPreferences = {
  meeting: {
    video: boolean
    audio: boolean
    maxTilesPerPage?: MaxTilesPerPage
    layout?: ContentTilesLayout
    audioDeviceId?: string
    videoDeviceId?: string
    audioOutputDeviceId?: string
  }
  pdf?: {
    [key: string]: {
      position: number
      config: {
        [key: string]: string
      }
    }
  }
}

export enum UserType {
  LEARNER = 'LEARNER',
  EDUCATOR = 'EDUCATOR',
}
