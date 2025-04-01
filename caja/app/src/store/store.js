import { configureStore } from "@reduxjs/toolkit";
import { chequeSlice } from "./cheque/chequeSlice";
import { tarjetaSlice } from "./tarjeta/tarjetaSlice";
import { tipoTarjetaSlice } from "./tipoTarjeta/tipoTarjetaSlice";


export const store = configureStore({
    reducer: {
        cheques: chequeSlice.reducer,
        tarjeta: tarjetaSlice.reducer,
        tipoTarjetas: tipoTarjetaSlice.reducer,
    }
})