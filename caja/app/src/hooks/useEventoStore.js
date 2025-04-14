import { useDispatch, useSelector } from "react-redux";
import { isSaving, patchEvent, postEvento, setActiveEvento, setEventos } from "../store/evento/eventoSlice";
import gestorApi from "../api/gestionApi";

export const useEventoStore = () => {

    const { eventos, eventoActive, isSavingEvento, messageErrorEvento } = useSelector(state => state.evento);
    const dispatch = useDispatch();

    const activeEvento = (id) => {
        const evento = eventos.find(elem => elem._id === id);
        console.log(evento);
        dispatch(setActiveEvento(evento))
    };

    const startSaving = () => {
        dispatch(isSaving());
    };

    const startGetEventos = async (month = 4, year = 2025) => {
        const api = await gestorApi();
        const { data } = await api.get(`evento/forMonthAndYear/${month}/${year}`,);

        dispatch(setEventos(data.eventos));

    };

    const startPatchEvento = async (evento, mes) => {

        let updateEvento = { ...evento };

        updateEvento.category = updateEvento.category._id ? updateEvento.category._id : updateEvento.category;

        const api = await gestorApi();
        const { data } = await api.patch(`/evento/${evento._id}`, updateEvento);

        if (mes.getMonth() + 1 === parseFloat(data.updateEvento.start_date.slice(5, 7))) {
            dispatch(patchEvent(data.updateEvento));
        }
    };

    const startPostEvento = async (evento, mes) => {
        const api = await gestorApi();
        const { data } = await api.post('/evento', evento);

        if (mes.getMonth() + 1 === parseFloat(data.evento.start_date.slice(5, 7))) {
            dispatch(postEvento(data.evento))
        }
    };



    return {
        //Atributos
        eventos,
        eventoActive,
        isSavingEvento,
        messageErrorEvento,

        //Metodos
        activeEvento,
        startGetEventos,
        startSaving,
        startPatchEvento,
        startPostEvento,

    }

};