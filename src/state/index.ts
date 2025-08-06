import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SearchVisible = {
  isNavbarSearchVisible: boolean;
};
type initialStateType = {
  isNavbarSearchVisible: boolean;
};

export const initialState: initialStateType = {
  isNavbarSearchVisible: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    switchSearchVisible: (state, action: PayloadAction<SearchVisible>) => {
      state.isNavbarSearchVisible = action.payload.isNavbarSearchVisible;
    },
  },
});

export const { switchSearchVisible } = globalSlice.actions;

export default globalSlice.reducer;
