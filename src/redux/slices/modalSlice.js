import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  modalType: "create",
  task: null,
  favoriteStatus: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.modalType = action.payload.modalType;
      state.task = action.payload.task;
      state.favoriteStatus = action.payload.favoriteStatus || false;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.favoriteStatus = false;
    },
    toggleFavorite: (state) => {
      state.favoriteStatus = !state.favoriteStatus;
    },
  },
});

export const { openModal, closeModal, toggleFavorite } = modalSlice.actions;
export default modalSlice.reducer;