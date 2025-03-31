import { configureStore } from "@reduxjs/toolkit";
import { chequeSlice } from "./cheque/chequeSlice";


export const store = configureStore({
    reducer: {
        cheques: chequeSlice.reducer
    }
})