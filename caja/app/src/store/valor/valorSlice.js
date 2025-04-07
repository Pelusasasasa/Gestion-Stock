import { createSlice } from '@reduxjs/toolkit';

export const valorSlice = createSlice({
    name: 'valor',
    initialState: {
        valores: [],
        valorActive: {},
        valorIsSaving: false
    },
    reducers: {
        emptyState: (state) => {
            state.valor = [];
            state.valorActive = {};
            state.valorIsSaving = false;
        },
        deleteValor: (state, { payload }) => {
            state.valores = state.valores.filter(elem => elem._id !== payload);
            state.valorActive = {};
            state.valorIsSaving = false;
        },
        isSaving: (state) => {
            state.valorIsSaving = true
        },
        postValor: (state, { payload }) => {
            state.valores.push(payload);
            state.valorIsSaving = false;
        },
        putValor: (state, { payload }) => {
            state.valores = state.valores.map(elem => {
                if (elem._id === payload._id) {
                    return payload;
                };
                return elem;
            });
            state.valorActive = {};
            state.valorIsSaving = false;
        },
        setValorActive: (state, { payload }) => {
            state.valorActive = payload;
            state.valorIsSaving = false
        },
        setValores: (state, { payload }) => {
            state.valores = payload;
            state.valorIsSaving = false;
        },


    }
});


// Action creators are generated for each case reducer function
export const { deleteValor, emptyState, isSaving, postValor, putValor, setValorActive, setValores } = valorSlice.actions;