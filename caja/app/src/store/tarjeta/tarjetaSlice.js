import { createSlice } from '@reduxjs/toolkit';

export const tarjetaSlice = createSlice({
    name: 'tarjeta',
    initialState: {
        tarjetas: [],
        tarjetaActive: {},
        isSavingTarjeta: false
    },
    reducers: {
        saving: (state) => {
            state.isSavingTarjeta = true
        },
    }
});


// Action creators are generated for each case reducer function
export const { saving } = tarjetaSlice.actions;