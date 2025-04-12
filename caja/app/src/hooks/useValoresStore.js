import { useDispatch, useSelector } from "react-redux"
import { deleteValor, isSaving, postValor, putValor, setValorActive, setValores } from "../store/valor/valorSlice";
import gestorApi from "../api/gestionApi";

export const useValoresStore = () => {

    const dispatch = useDispatch();
    const { valores, valorActive, valorIsSaving } = useSelector(state => state.valores);

    const startActive = (id) => {

        const active = valores.find(elem => elem._id === id);
        if (!active) return;

        dispatch(setValorActive(active));
    }

    const startDeleteOne = async (id) => {
        dispatch(isSaving());

        const api = await gestorApi();
        const { data } = await api.delete(`valores/forId/${id}`);

        dispatch(deleteValor(data.deleteValor._id));

    };

    const startGetAll = async () => {
        const api = await gestorApi()
        const { data } = await api.get('valores');
        dispatch(setValores(data.valores));

    }

    const startPostOne = async (valor) => {
        dispatch(isSaving());
        const api = await gestorApi();
        const { data } = await api.post('valores', valor);

        dispatch(postValor(data.valor));
    };

    const startPatchOne = async (valor) => {
        dispatch(isSaving());
        const api = await gestorApi();
        const { data } = await api.patch(`valores/forId/${valor._id}`, valor);


        dispatch(putValor(data.updateValor));
    };


    return {
        //Atributos
        valores,
        valorActive,
        valorIsSaving,

        //Metdos
        startActive,
        startDeleteOne,
        startGetAll,
        startPatchOne,
        startPostOne,
    }
}