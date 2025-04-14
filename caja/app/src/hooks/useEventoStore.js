import { useDispatch, useSelector } from "react-redux";
import { isSaving, setEventos } from "../store/evento/eventoSlice";
import gestorApi from "../api/gestionApi";

export const useEventoStore = () => {

    const { eventos, eventoActive, isSavingEvento, messageErrorEvento } = useSelector(state => state.evento);
    const dispatch = useDispatch();

    const startGetEventos = async (month = 4, year = 2025) => {
        const api = await gestorApi();
        const { data } = await api.get(`evento/forMonthAndYear/${month}/${year}`,);

        dispatch(setEventos(data.eventos));

    }

    return {
        //Atributos
        eventos,
        eventoActive,
        isSavingEvento,
        messageErrorEvento,

        //Metodos
        startGetEventos
    }

};