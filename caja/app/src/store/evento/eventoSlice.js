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
        deleleEvent: (state, { payload }) => {
            state.eventos = state.eventos.filter(elem => elem._id !== payload);
            state.isSavingEvento = false
        },
        emptyEventoActive: (state) => {
            state.eventoActive = {}
        },
        isSaving: (state) => {
            state.isSavingEvento = true;
        },
        setActiveEvento: (state, { payload }) => {
            state.eventoActive = payload;
        },
        setEventos: (state, { payload }) => {
            state.eventos = payload;
            state.isSavingEvento = false;
            state.messageErrorEvento = undefined;
        },
        patchEvent: (state, { payload }) => {
            state.eventos = state.eventos.map((elem) => {
                if (elem._id === payload._id) {
                    return payload;
                };

                return elem
            });

            state.isSavingEvento = false;
            state.eventoActive = {};
        },
        popEvento: (state, { payload }) => {
            state.eventos = state.eventos.filter(elem => elem._id !== payload);
            state.isSavingEvento = false;
        },
        postEvento: (state, { payload }) => {
            state.eventos.push(payload);
            state.isSavingEvento = false;
        }
    }
});


// Action creators are generated for each case reducer function
export const { deleleEvent, emptyEventoActive, isSaving, setActiveEvento, setEventos, patchEvent, popEvento, postEvento } = eventoSlice.actions;