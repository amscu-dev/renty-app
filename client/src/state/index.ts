import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchVisible {
  isNavbarSearchVisible: boolean;
}
export interface FiltersState {
  location: string;
  beds: string;
  baths: string;
  propertyType: string;
  amenities: string[];
  // availableFrom: string;
  priceRange: [number, number] | [null, null];
  squareFeet: [number, number] | [null, null];
  coordinates: [number, number];
  destroySearch: boolean;
}

interface InitialStateTypes {
  isNavbarSearchVisible: boolean;
  filters: FiltersState;
  isFiltersFullOpen: boolean;
  viewMode: "grid" | "list";
}

export const initialState: InitialStateTypes = {
  filters: {
    location: "Los Angeles",
    beds: "any",
    baths: "any",
    propertyType: "any",
    amenities: [],
    // availableFrom: "any",
    priceRange: [null, null],
    squareFeet: [null, null],
    coordinates: [-118.25, 34.05],
    destroySearch: false,
  },
  isFiltersFullOpen: false,
  viewMode: "list",
  isNavbarSearchVisible: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    switchSearchVisible: (state, action: PayloadAction<SearchVisible>) => {
      state.isNavbarSearchVisible = action.payload.isNavbarSearchVisible;
    },
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    toggleFiltersFullOpen: (state) => {
      state.isFiltersFullOpen = !state.isFiltersFullOpen;
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
  },
});

export const {
  switchSearchVisible,
  setFilters,
  toggleFiltersFullOpen,
  setViewMode,
} = globalSlice.actions;

export default globalSlice.reducer;
