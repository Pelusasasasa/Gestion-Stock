import { createSlice } from '@reduxjs/toolkit';

export const tipoTarjetaSlice = createSlice({
    name: 'tipoTarjeta',
    initialState: {
        tiposTarjetas: [],
        tipoTarjetaActive: {},
        isSavingTipoTarjeta: false
    },
    reducers: {
        savingTipoTarjeta: (state) => {
            state.isSavingTipoTarjeta = true
        },
        getTiposTarjetas: (state, { payload }) => {
            state.tiposTarjetas = payload;
            state.isSavingTipoTarjeta = false
        }
    }
});


// Action creators are generated for each case reducer function
export const { getTiposTarjetas, savingTipoTarjeta } = tipoTarjetaSlice.actions;