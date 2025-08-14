import { createSlice } from '@reduxjs/toolkit';



export const tipoCuentaSlice = createSlice({
    name: 'tipoCuenta',
    initialState: {
        tipoCuentas: [],
        isSavingTipoCuenta: false,
        tipoCuentaActive: {}
    },
    reducers: {
        deleteTipoCuenta: (state, { payload }) => {
            state.tipoCuentas = state.tipoCuentas.filter(elem => elem._id !== payload);
            state.isSavingTipoCuenta = false;
        },
        savingTipoCuenta: (state) => {
            state.isSavingTipoCuenta = true;
        },
        setTiposCuentasActive: (state, { payload }) => {
            state.tipoCuentaActive = payload;
            state.isSavingTipoCuenta = false;
        },
        setTipoCuentas: (state, { payload }) => {
            state.tipoCuentas = payload;
        },
        patchTipoCuenta: (state, { payload }) => {
            state.tipoCuentas = state.tipoCuentas.map(elem => {
                if (elem._id === payload._id) {
                    return payload;
                };

                return elem;
            });
            state.isSavingTipoCuenta = false;
        },
        postTipoCuenta: (state, { payload }) => {
            state.tipoCuentas.push(payload);
            state.isSavingTipoCuenta = false;
        },

    }
});


// Action creators are generated for each case reducer function
export const { deleteTipoCuenta, savingTipoCuenta, setTiposCuentasActive, setTipoCuentas, patchTipoCuenta, postTipoCuenta } = tipoCuentaSlice.actions;