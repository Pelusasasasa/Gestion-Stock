import { configureStore } from "@reduxjs/toolkit";
import { chequeSlice } from "./cheque/chequeSlice";
import { tarjetaSlice } from "./tarjeta/tarjetaSlice";
import { tipoTarjetaSlice } from "./tipoTarjeta/tipoTarjetaSlice";
import { valorSlice } from "./valor/valorSlice";
import { provedorSlice } from "./provedor/provedorSlice";
import { vendedorSlice } from "./vendedor/vendedorSlice";
import { eventoSlice } from "./evento/eventoSlice";


export const store = configureStore({
    reducer: {
        cheques: chequeSlice.reducer,
        tarjeta: tarjetaSlice.reducer,
        tipoTarjetas: tipoTarjetaSlice.reducer,
        valores: valorSlice.reducer,
        provedor: provedorSlice.reducer,
        vendedor: vendedorSlice.reducer,
        evento: eventoSlice.reducer
    }
})