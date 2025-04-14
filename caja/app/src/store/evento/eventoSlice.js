import { createSlice } from '@reduxjs/toolkit';

export const eventoSlice = createSlice({
    name: 'evento',
    initialState: {
        eventos: [],
        eventoActive: {},
        isSavingEvento: false,
        messageErrorEvento: undefined
    },
    reducers: {
        isSaving: (state) => {
            state.isSavingEvento = true
        },
        setEventos: (state, { payload }) => {
            state.eventos = payload;
            state.isSavingEvento = false;
            undefined
        }
    }
});


// Action creators are generated for each case reducer function
export const { isSaving, setEventos } = eventoSlice.actions;