import gestorApi from "../api/gestionApi";
import { deleteCheque, emptyCheque, emptyValues, isSaving, postCheque, setActive, setCheques, updateCheque } from "../store/cheque/chequeSlice";
import { useDispatch, useSelector } from "react-redux";

export const useChequeStore = () => {
    const dispatch = useDispatch();
    const { cheques, chequeActive, isSavingCheque } = useSelector(state => state.cheques);

    const emptyActiveCheque = () => {
        dispatch(emptyCheque())
    };

    const startGetAllCheques = async () => {
        const api = await gestorApi();
        const { data } = await api.get('cheques');

        dispatch(setCheques(data.cheques))
    };

    const startPostOne = async (cheque) => {
        cheque.importe = parseFloat(cheque.importe);

        const api = await gestorApi();
        const { data } = await api.post('/cheques', cheque);

        dispatch(postCheque(data.cheque));
    };

    const startUpdateOne = async (cheque) => {
        dispatch(isSaving());
        cheque.importe = parseFloat(cheque.importe);

        const api = await gestorApi();
        const { data } = await api.patch(`/cheques/forId/${cheque._id}`, cheque);

        dispatch(updateCheque(data.chequeUpdate));
    };

    const startEmptyCheques = async () => {
        dispatch(emptyValues());
    };

    const startDeleteCheque = async (id) => {
        dispatch(isSaving());

        const api = await gestorApi();
        const { data } = await api.delete(`/cheques/forId/${id}`);

        dispatch(deleteCheque(data.chequeDelete._id));
    };

    const startSetActiveCheque = async (id) => {
        const cheque = cheques.find(elem => elem._id === id);
        dispatch(setActive(cheque));
    };

    return {
        //atributos
        cheques,
        chequeActive,
        isSavingCheque,

        //metodos
        emptyActiveCheque,
        startDeleteCheque,
        startEmptyCheques,
        startGetAllCheques,
        startPostOne,
        startSetActiveCheque,
        startUpdateOne
    }
};


