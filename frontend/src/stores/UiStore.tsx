import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SectionType = 'dashboard' | 'usersRoles' | 'systemSettings';

interface UIState {
  slidebarOpen: boolean;
  slidebarSections: Record<SectionType, boolean>;
  slidebarActiveItem: string;
  navbarActiveItem: string;
  navbarMenuOpen: boolean;
}

const initialState: UIState = {
  slidebarOpen: true,
  slidebarSections: {
    dashboard: true,
    usersRoles: true,
    systemSettings: true,
  },
  slidebarActiveItem: 'dashboard',
  navbarActiveItem: 'home',
  navbarMenuOpen: false,
};

const UiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSlidebar(state) {
      state.slidebarOpen = !state.slidebarOpen;
      if (!state.slidebarOpen) {
        state.slidebarSections = { dashboard: false, usersRoles: false, systemSettings: false };
      } else {
        state.slidebarSections = { dashboard: true, usersRoles: true, systemSettings: true };
      }
    },
    toggleSection(state, action: PayloadAction<SectionType>) {
      if (!state.slidebarOpen) return;
      state.slidebarSections[action.payload] = !state.slidebarSections[action.payload];
    },
    setSlidebarActiveItem(state, action: PayloadAction<string>) {
      state.slidebarActiveItem = action.payload;
    },
    setNavbarActiveItem(state, action: PayloadAction<string>) {
      state.navbarActiveItem = action.payload;
    },
    setNavbarMenuOpen(state, action: PayloadAction<boolean>) {
      state.navbarMenuOpen = action.payload;
    },
    resetUI(state) {
      // Optional: Reset UI state (for logout or clear)
      Object.assign(state, initialState);
    }
  },
});

export const {
  toggleSlidebar,
  toggleSection,
  setSlidebarActiveItem,
  setNavbarActiveItem,
  setNavbarMenuOpen,
  resetUI,
} = UiSlice.actions;

export default UiSlice.reducer;