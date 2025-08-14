import { createSlice } from '@reduxjs/toolkit';

export const tipoTarjetaSlice = createSlice({
    name: 'tipoTarjeta',
    initialState: {
        tiposTarjetas: [],
        tipoTarjetaActive: {},
        isSavingTipoTarjeta: false
    },
    reducers: {
        deleteTipoTarjeta: (state, { payload }) => {
            state.tiposTarjetas = state.tiposTarjetas.filter(elem => elem._id !== payload)
            state.isSavingTipoTarjeta = false
        },
        savingTipoTarjeta: (state) => {
            state.isSavingTipoTarjeta = true
        },
        getTiposTarjetas: (state, { payload }) => {
            state.tiposTarjetas = payload;
            state.isSavingTipoTarjeta = false
        },
        postTipoTarjeta: (state, { payload }) => {
            state.tiposTarjetas.push(payload);
            state.isSavingTipoTarjeta = false
        },
        putTipoTarjeta: (state, { payload }) => {
            state.tiposTarjetas = state.tiposTarjetas.map(elem => {
                if (elem._id === payload._id) {
                    return payload;
                };
                return elem;
            });
            state.isSavingTipoTarjeta = false;
        }
    }
});


// Action creators are generated for each case reducer function
export const { deleteTipoTarjeta, getTiposTarjetas, savingTipoTarjeta, postTipoTarjeta, putTipoTarjeta } = tipoTarjetaSlice.actions;