import { createSlice } from '@reduxjs/toolkit';

export const movimientoSlice = createSlice({
    name: 'movimiento',
    initialState: {
        movimientos: [],
        movimientoActive: {},
        isSavingMovimiento: false,
    },
    reducers: {
        savingMovimiento: (state) => {
            state.isSavingMovimiento = true;
        },
        deleteMovimiento: (state, { payload }) => {
            state.movimientos = state.movimientos.filter(elem => elem._id !== payload);
            state.isSavingMovimiento = false;
        },
        setEmptyActive: (state) => {
            state.movimientoActive = {};
        },
        setMovimientoActive: (state, { payload }) => {
            state.movimientoActive = payload;
        },
        setMovimientos: (state, { payload }) => {
            state.movimientos = payload;
            state.isSavingMovimiento = false;
        },
        patchMovimiento: (state, { payload }) => {
            state.movimientos = state.movimientos.map(elem => {
                if (elem._id === payload._id) {
                    return payload;
                }

                return elem;
            });
            state.isSavingMovimiento = false;
            state.movimientoActive = {};
        },
        postMovimiento: (state, { payload }) => {
            state.movimientos.push(payload);
            state.isSavingMovimiento = false;
        }
    }
});


// Action creators are generated for each case reducer function
export const {
    savingMovimiento,
    deleteMovimiento,
    setEmptyActive,
    setMovimientoActive,
    setMovimientos,
    patchMovimiento,
    postMovimiento
} = movimientoSlice.actions;