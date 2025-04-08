import { createSlice } from '@reduxjs/toolkit';

export const provedorSlice = createSlice({
    name: 'provedor',
    initialState: {
        provedores: [
            {
                nombre: "Distribuidora Tecnológica S.A.",
                direccion: "Av. Rivadavia 1234, CABA",
                telefono: "+54 11 4567-8901",
                email: "contacto@distritec.com.ar",
                saldo: 15750.00,
                iva: "Responsable Inscripto"
            },
            {
                nombre: "Distribuidora Tecnológica S.A.",
                direccion: "Av. Rivadavia 1234, CABA",
                telefono: "+54 11 4567-8901",
                email: "contacto@distritec.com.ar",
                saldo: 15750.00,
                iva: "Responsable Inscripto"
            }
        ],
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
            state.provedores = state.provedores.filter(elem => elem._id !== payload);
            state.provedorActive = {};
            state.provedorIsSaving = false;
        },
        isSaving: (state) => {
            state.provedorIsSaving = true;
        },
        postProvedor: (state, {payload}) => {
            state.provedores.push(payload);
            state.provedorIsSaving = false;
        },
        putValor: (state, { payload }) => {
            state.provedores = state.provedores.map(elem => {
                if (elem._id === payload._id){
                    return payload;
                };

                return elem;
            });
            state.provedorActive = {};
            state.provedorIsSaving = false;
        },
        setMensageError: (state, { payload}) => {
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