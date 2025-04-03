import { createSlice } from '@reduxjs/toolkit';

export const tarjetaSlice = createSlice({
    name: 'tarjeta',
    initialState: {
        tarjetas: [],
        tarjetaActive: {},
        isSavingTarjeta: false
    },
    reducers: {
        emptyActive: (state) => {
            state.tarjetaActive = {}
        },
        saving: (state) => {
            state.isSavingTarjeta = true
        },
        setTarjeta: (state, { payload }) => {
            state.tarjetas.push(payload)
        },
        getTarjetas: (state, { payload }) => {
            state.tarjetas = payload;
        },
        deleteTarjeta: (state, { payload }) => {
            state.tarjetas = state.tarjetas.filter((elem) => elem._id !== payload._id);
            state.isSavingTarjeta = false;
        },
        setActiveTarjeta: (state, { payload }) => {
            state.tarjetaActive = state.tarjetas.find((elem) => elem._id === payload);
        },
        updateTarjeta: (state, { payload }) => {
            state.tarjetas = state.tarjetas.map(elem => {
                if (elem._id === payload._id) {
                    return payload
                };
                return elem;
            });

            state.tarjetaActive = {};
            state.isSavingTarjeta = false
        }
    }
});


// Action creators are generated for each case reducer function
export const {
    deleteTarjeta,
    emptyActive,
    getTarjetas,
    setActiveTarjeta,
    setTarjeta,
    saving,
    updateTarjeta
} = tarjetaSlice.actions;