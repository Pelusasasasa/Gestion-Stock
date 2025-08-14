import { createSlice } from '@reduxjs/toolkit';

export const vendedorSlice = createSlice({
    name: 'vendedor',
    initialState: {
        nombre: '',
        permiso: 2
    },
    reducers: {
        emptyValores: (state) => {
            state.nombre = '';
            state.permiso = 2;
        },
        setValores: (state, { payload }) => {
            state.nombre = payload.nombre;
            state.permiso = payload.permiso
        },
    }
});


// Action creators are generated for each case reducer function
export const { emptyValores, setValores } = vendedorSlice.actions;