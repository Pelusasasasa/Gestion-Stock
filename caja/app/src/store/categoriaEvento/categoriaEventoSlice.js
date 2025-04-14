import { createSlice } from '@reduxjs/toolkit';

export const categoriaEventoSlice = createSlice({
    name: 'categoriaEvento',
    initialState: {
        categoriaEventos: [],
        categoriaEventosActive: {},
        isSavingCategoriaEvento: false
    },
    reducers: {
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
        postCategoriaEvento: (state, { payload }) => {
            state.categoriaEventos.push(payload);
        }
    }
});


// Action creators are generated for each case reducer function
export const { savingCategoriaEvento, setActiveCategoriaEvento, setCategorias, postCategoriaEvento } = categoriaEventoSlice.actions;