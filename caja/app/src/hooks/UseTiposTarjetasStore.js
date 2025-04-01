import { useDispatch, useSelector } from "react-redux"
import gestorApi from "../api/gestionApi";
import { getTiposTarjetas } from "../store/tipoTarjeta/tipoTarjetaSlice";


export const useTiposTarjetasStore = () => {
    const dispatch = useDispatch();
    const { isSavingTipoTarjeta, tiposTarjetas, tipoTarjetaActive } = useSelector(state => state.tipoTarjetas);

    const startGetTiposTarjetas = async () => {
        const { data } = await gestorApi.get('tipoTarjeta');

        console.log(data);

        dispatch(getTiposTarjetas(data.tipos))
    }

    return {
        //Atributos
        isSavingTipoTarjeta,
        tiposTarjetas,
        tipoTarjetaActive,

        //Metodos
        startGetTiposTarjetas
    }
}