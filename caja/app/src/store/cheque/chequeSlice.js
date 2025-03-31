import { createSlice } from '@reduxjs/toolkit';

export const chequeSlice = createSlice({
    name: 'cheque',
    initialState: {
        cheques: [],
        chequeActive: {},
        isSavingCheque: false
    },
    reducers: {
        emptyValues: (state) => {
            state.cheques = []
            state.chequeActive = {}
            state.isSavingCheque = false
        },
        isSaving: (state) => {
            state.isSavingCheque = true
        },
        postCheque: (state, { payload }) => {
            state.cheques.push(payload)
        },
        setCheques: (state, { payload }) => {
            state.cheques = payload
        }
    }
});


// Action creators are generated for each case reducer function
export const { emptyValues, isSaving, postCheque, setCheques } = chequeSlice.actions;