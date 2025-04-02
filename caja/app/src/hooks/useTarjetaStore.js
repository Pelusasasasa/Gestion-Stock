import { useDispatch, useSelector } from "react-redux"
import gestorApi from "../api/gestionApi";
import { deleteTarjeta, emptyActive, getTarjetas, saving, setActiveTarjeta, setTarjeta } from "../store/tarjeta/tarjetaSlice";

export const useTarjetaStore = () => {
    const dispatch = useDispatch();
    const { isSavingTarjeta, tarjetas, tarjetaActive } = useSelector(state => state.tarjeta);


    const emptyActiveTarjeta = async () => {
        dispatch(emptyActive())
    };

    const startGetTarjetas = async () => {
        const { data } = await gestorApi.get('tarjetas');

        dispatch(getTarjetas(data.tarjetas))
    };

    const startPostTarjeta = async (tarjeta) => {
        console.log(tarjeta);
        const { data } = await gestorApi.post('tarjetas', tarjeta);

        dispatch(setTarjeta(data.tarjeta))
    };

    const startDeleteTarjeta = async (id) => {
        dispatch(saving());

        const { data } = await gestorApi.delete(`tarjetas/forId/${id}`);
        dispatch(deleteTarjeta(data.deleteTarjeta))
    };

    const startUpdateTarjeta = async (id) => {
        dispatch(setActiveTarjeta(id))
    };

    return {
        //Atributos
        isSavingTarjeta,
        tarjetas,
        tarjetaActive,

        //Metodos
        emptyActiveTarjeta,
        startDeleteTarjeta,
        startGetTarjetas,
        startPostTarjeta,
        startUpdateTarjeta
    }
}