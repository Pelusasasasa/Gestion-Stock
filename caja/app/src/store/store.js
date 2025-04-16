import { configureStore } from "@reduxjs/toolkit";
import { chequeSlice } from "./cheque/chequeSlice";
import { tarjetaSlice } from "./tarjeta/tarjetaSlice";
import { tipoTarjetaSlice } from "./tipoTarjeta/tipoTarjetaSlice";
import { valorSlice } from "./valor/valorSlice";
import { provedorSlice } from "./provedor/provedorSlice";
import { vendedorSlice } from "./vendedor/vendedorSlice";
import { eventoSlice } from "./evento/eventoSlice";
import { categoriaEventoSlice } from "./categoriaEvento/categoriaEventoSlice";
import { tipoCuentaSlice } from "./tipoCuenta/tipoCuentaSlice";


export const store = configureStore({
    reducer: {
        categoriaEvento: categoriaEventoSlice.reducer,
        cheques: chequeSlice.reducer,
        evento: eventoSlice.reducer,
        provedor: provedorSlice.reducer,
        tarjeta: tarjetaSlice.reducer,
        tipoCuenta: tipoCuentaSlice.reducer,
        tipoTarjetas: tipoTarjetaSlice.reducer,
        valores: valorSlice.reducer,
        vendedor: vendedorSlice.reducer,
    }
})