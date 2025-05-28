import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    contactLoading: false,
    contactMessage: { message: "", type: "" },
};

const contactSlice = createSlice({
    name: "contact",
    initialState,
    reducers: {
        setContactLoading: (state, action) => {
            state.contactLoading = action.payload;
        },
        setContactMessage: (state, action) => {
            state.contactMessage = action.payload;
        },
    },
});

export const {
    setContactLoading,
    setContactMessage,

} = contactSlice.actions;

export default contactSlice.reducer;
