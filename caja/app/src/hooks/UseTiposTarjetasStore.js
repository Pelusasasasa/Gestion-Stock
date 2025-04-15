import { useDispatch, useSelector } from "react-redux"
import gestorApi from "../api/gestionApi";
import { deleteTipoTarjeta, getTiposTarjetas, postTipoTarjeta, putTipoTarjeta } from "../store/tipoTarjeta/tipoTarjetaSlice";
import Swal from "sweetalert2";


export const useTiposTarjetasStore = () => {
    const dispatch = useDispatch();
    const { isSavingTipoTarjeta, tiposTarjetas, tipoTarjetaActive } = useSelector(state => state.tipoTarjetas);

    const startDeleteTipoTarjetas = async (id) => {
        const api = await gestorApi();

        const { data } = await api.delete(`tipoTarjeta/${id}`);

        dispatch(deleteTipoTarjeta(data.deleteTipo._id));
    };

    const startGetTiposTarjetas = async () => {
        const api = await gestorApi()
        const { data } = await api.get('tipoTarjeta');
        dispatch(getTiposTarjetas(data.tipos))
    };

    const startPostTiposTarjetas = async (tipo) => {
        const api = await gestorApi();

        const { data } = await api.post('tipoTarjeta', tipo);

        dispatch(postTipoTarjeta(data.tipo))

    };

    const startPutTiposTarjetas = async (tipo) => {
        const api = await gestorApi();
        try {
            const { data } = await api.patch(`tipoTarjeta/${tipo._id}`, tipo);
            dispatch(putTipoTarjeta(data.updateTipo));
        } catch (error) {
            await Swal.fire('No se pudo modificar la tarjeta', error.response.data.msg, 'error')
        };
    }

    return {
        //Atributos
        isSavingTipoTarjeta,
        tiposTarjetas,
        tipoTarjetaActive,

        //Metodos
        startDeleteTipoTarjetas,
        startGetTiposTarjetas,
        startPostTiposTarjetas,
        startPutTiposTarjetas
    }
}