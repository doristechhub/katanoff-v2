import { createSlice } from "@reduxjs/toolkit";

export const initialAppointmentValues = {
    firstName: "",
    lastName: "",
    email: "",
    date: "",
    time: "",
    phone: undefined,
    message: "",
};

const initialState = {
    appointmentLoading: false,
    appointmentMessage: { message: "", type: "" },
};

const appointmentSlice = createSlice({
    name: "appointment",
    initialState,
    reducers: {
        setAppointmentLoading: (state, action) => {
            state.appointmentLoading = action.payload;
        },
        setAppointmentMessage: (state, action) => {
            state.appointmentMessage = action.payload;
        },
    },
});

export const {
    setAppointmentLoading,
    setAppointmentMessage,

} = appointmentSlice.actions;

export default appointmentSlice.reducer;
