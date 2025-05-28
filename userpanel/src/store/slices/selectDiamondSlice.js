import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    diamondSelection: {
        shape: null,
        caratWeight: null,
        clarity: null,
        color: null,
    }
};

const selectDiamondSlice = createSlice({
    name: "selectedDiamond",
    initialState,
    reducers: {
        setDiamondSelection: (state, action) => {
            state.diamondSelection = {
                ...state.diamondSelection,
                ...action.payload
            };
        },
        resetDiamondSelection: (state) => {
            state.diamondSelection = initialState.diamondSelection;
        }
    }
});

export const {
    setDiamondSelection,
    resetDiamondSelection
} = selectDiamondSlice.actions;

export default selectDiamondSlice.reducer;