import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    subscriberMessage: { message: "", type: "" },
    subscriberLoading: false,
};

const subscriberSlice = createSlice({
    name: "subscriber",
    initialState,
    reducers: {
        setSubscriberMessage: (state, action) => {
            state.subscriberMessage = action.payload;
        },
        setSubscriberLoading: (state, action) => {
            state.subscriberLoading = action.payload
        }
    },
});

export const {
    setSubscriberMessage,
    setSubscriberLoading
} = subscriberSlice.actions;

export default subscriberSlice.reducer;
