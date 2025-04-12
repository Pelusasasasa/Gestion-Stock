import { createSlice } from '@reduxjs/toolkit';

export const provedorSlice = createSlice({
    name: 'provedor',
    initialState: {
        provedores: [],
        provedorActive: {},
        provedorIsSaving: false,
        messageErrorProvedor: undefined
    },
    reducers: {
        emptyState: (state) => {
            state.provedores = [];
            state.provedorActive = {};
            state.provedorIsSaving = false;
        },
        deleteProvedor: (state, { payload }) => {
            console.log(payload);
            state.provedores = state.provedores.filter(elem => elem._id !== payload);
            state.provedorActive = {};
            state.provedorIsSaving = false;
        },
        isSaving: (state) => {
            state.provedorIsSaving = true;
        },
        postProvedor: (state, { payload }) => {
            state.provedores.push(payload);
            state.provedorIsSaving = false;
        },
        putValor: (state, { payload }) => {
            state.provedores = state.provedores.map(elem => {
                if (elem._id === payload._id) {
                    return payload;
                };

                return elem;
            });
            state.provedorActive = {};
            state.provedorIsSaving = false;
        },
        setMensageError: (state, { payload }) => {
            state.messageErrorProvedor = payload;
        },
        setProvedorActive: (state, { payload }) => {
            state.provedorActive = payload;
            state.provedorIsSaving = false;
        },
        setProvedores: (state, { payload }) => {
            state.provedores = payload;
            state.provedorIsSaving = false;
        },
    }
});


// Action creators are generated for each case reducer function
export const { emptyState, deleteProvedor, isSaving, postProvedor, putValor, setMensageError, setProvedorActive, setProvedores } = provedorSlice.actions;