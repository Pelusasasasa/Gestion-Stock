import gestorApi from "../api/gestionApi";
import { emptyValues, postCheque, setCheques } from "../store/cheque/chequeSlice";
import { useDispatch, useSelector } from "react-redux";

export const useChequeStore = () => {
    const dispatch = useDispatch();
    const { cheques, chequeActive, isSavingCheque } = useSelector(state => state.cheques);

    const startGetAllCheques = async () => {
        const { data } = await gestorApi.get('cheques');

        dispatch(setCheques(data.cheques))
    };

    const startPostOne = async (cheque) => {

        cheque.importe = parseFloat(cheque.importe);
        console.log(cheque)
        const { data } = await gestorApi.post('/cheques', cheque);

        dispatch(postCheque(data.cheque));
    };

    const startEmptyCheques = async () => {
        dispatch(emptyValues());
    }

    return {
        //atributos
        cheques,
        chequeActive,
        isSavingCheque,

        //metodos
        startGetAllCheques,
        startPostOne,
        startEmptyCheques
    }
};


