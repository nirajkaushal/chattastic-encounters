import { createSlice } from '@reduxjs/toolkit'

import { renameSliceActions } from '@/stores/helpers'

export enum ContentTilesLayout {
  Default = 'default',
  Spotlight = 'spotlight',
  Sidebar = 'sidebar',
  Topbar = 'topbar',
}

export type MaxTilesPerPage = 6 | 9 | 12 | 18 | 27 | 36

type ContentTilesLayoutConfig = {
  layout: ContentTilesLayout
  hideSelfTile?: boolean
  maxTilesPerPage: MaxTilesPerPage
  hideTilesWithNoVideo?: boolean
}

export interface LiveLayoutState {
  leftSidebarMode: 'maximized' | 'minimized' | 'collapsed'
  rightSidebarMode: 'participants' | 'chat' | 'plugins' | 'frame-notes' | null
  changeContentTilesLayoutModalOpen: boolean
  contentTilesLayoutConfig: ContentTilesLayoutConfig
}

const initialState: LiveLayoutState = {
  leftSidebarMode: 'collapsed',
  rightSidebarMode: null,
  changeContentTilesLayoutModalOpen: false,
  contentTilesLayoutConfig: {
    layout: ContentTilesLayout.Default,
    maxTilesPerPage: 6,
  },
}

export const layoutLiveSlice = createSlice({
  name: 'live-layout',
  initialState,
  reducers: {
    minimizeLeftSidebar(state) {
      state.leftSidebarMode = 'minimized'
    },
    maximizeLeftSidebar(state) {
      state.leftSidebarMode = 'maximized'
    },
    collapseLeftSidebar(state) {
      state.leftSidebarMode = 'collapsed'
    },
    toggleLeftSidebar(state) {
      // Toggle between collapsed and maximized
      if (state.leftSidebarMode === 'collapsed') {
        state.leftSidebarMode = 'maximized'
      } else {
        state.leftSidebarMode = 'collapsed'
      }
    },
    setRightSidebar(state, action) {
      state.rightSidebarMode = action.payload
    },
    closeRightSidebar(state) {
      state.rightSidebarMode = null
    },

    // Change content tiles layout modal
    openChangeContentTilesLayoutModal(state) {
      state.changeContentTilesLayoutModalOpen = true
    },
    closeChangeContentTilesLayoutModal(state) {
      state.changeContentTilesLayoutModalOpen = false
    },

    // Change content tiles layout
    changeContentTilesLayoutConfig(
      state,
      action: {
        payload: Partial<ContentTilesLayoutConfig>
        type: string
      }
    ) {
      state.contentTilesLayoutConfig = {
        ...state.contentTilesLayoutConfig,
        ...action.payload,
      }
    },
  },
})

export const {
  minimizeLeftSidebarAction,
  maximizeLeftSidebarAction,
  collapseLeftSidebarAction,
  toggleLeftSidebarAction,
  setRightSidebarAction,
  closeRightSidebarAction,
  openChangeContentTilesLayoutModalAction,
  closeChangeContentTilesLayoutModalAction,
  changeContentTilesLayoutConfigAction,
} = renameSliceActions(layoutLiveSlice.actions)
