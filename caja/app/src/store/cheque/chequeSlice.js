import { createSlice } from '@reduxjs/toolkit';

export const chequeSlice = createSlice({
    name: 'cheque',
    initialState: {
        cheques: [],
        chequeActive: {},
        isSavingCheque: false
    },
    reducers: {
        deleteCheque: (state, { payload }) => {
            state.cheques = state.cheques.filter(elem => elem._id !== payload);
            state.chequeActive = {};
            state.isSavingCheque = false
        },
        emptyCheque: (state) => {
            state.chequeActive = {};
        },
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
        setActive: (state, { payload }) => {
            state.chequeActive = payload
        },
        setCheques: (state, { payload }) => {
            state.cheques = payload
        },
        updateCheque: (state, { payload }) => {
            state.cheques = state.cheques.map(elem => {
                if (elem._id === payload._id) {
                    return payload;
                }
                return elem;
            });
            state.chequeActive = {};
            state.isSavingCheque = false
        }
    }
});


// Action creators are generated for each case reducer function
export const { deleteCheque, emptyCheque, emptyValues, isSaving, postCheque, setActive, setCheques, updateCheque } = chequeSlice.actions;