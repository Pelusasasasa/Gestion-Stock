import { createSlice } from '@reduxjs/toolkit';

export const categoriaEventoSlice = createSlice({
    name: 'categoriaEvento',
    initialState: {
        categoriaEventos: [],
        categoriaEventosActive: {},
        isSavingCategoriaEvento: false
    },
    reducers: {
        deleteCategoria: (state, { payload }) => {
            state.categoriaEventos = state.categoriaEventos.filter(elem => elem._id !== payload);
            state.isSavingCategoriaEvento = false
        },
        savingCategoriaEvento: (state) => {
            state.isSavingCategoriaEvento = true
        },
        setActiveCategoriaEvento: (state, { payload }) => {
            state.categoriaEventosActive = payload
        },
        setCategorias: (state, { payload }) => {
            state.categoriaEventos = payload;
            state.isSavingCategoriaEvento = false
        },
        patchCategoriaEvento: (state, { payload }) => {
            state.categoriaEventos = state.categoriaEventos.map(elem => {
                if (elem._id === payload._id) {
                    return payload;
                };
                return elem;
            });
            state.isSavingCategoriaEvento = false;
        },
        postCategoriaEvento: (state, { payload }) => {
            state.categoriaEventos.push(payload);
            state.isSavingCategoriaEvento = false;
        }
    }
});


// Action creators are generated for each case reducer function
export const { deleteCategoria, savingCategoriaEvento, setActiveCategoriaEvento, setCategorias, patchCategoriaEvento, postCategoriaEvento } = categoriaEventoSlice.actions;