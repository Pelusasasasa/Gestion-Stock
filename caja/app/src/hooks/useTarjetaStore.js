import { useDispatch, useSelector } from "react-redux"
import gestorApi from "../api/gestionApi";
import { deleteTarjeta, emptyActive, getTarjetas, saving, setActiveTarjeta, setTarjeta, updateTarjeta } from "../store/tarjeta/tarjetaSlice";
import Swal from "sweetalert2";

export const useTarjetaStore = () => {
    const dispatch = useDispatch();
    const { isSavingTarjeta, tarjetas, tarjetaActive } = useSelector(state => state.tarjeta);


    const emptyActiveTarjeta = async () => {
        dispatch(emptyActive())
    };

    const startSetActiveTarjeta = async (id) => {
        dispatch(setActiveTarjeta(id));
    };

    const startGetTarjetas = async () => {
        const api = await gestorApi();
        const { data } = await api.get('tarjetas');

        data.tarjetas.sort((a, b) => {
            if (a.tarjeta.nombre > b.tarjeta.nombre) return 1;
            if (a.tarjeta.nombre < b.tarjeta.nombre) return -1;
            return 0;
        });

        dispatch(getTarjetas(data.tarjetas))
    };

    const startPostTarjeta = async (tarjeta) => {


        const api = await gestorApi();
        const { data } = await api.post('tarjetas', tarjeta);

        dispatch(setTarjeta(data.tarjeta))
    };

    const startDeleteTarjeta = async (id) => {
        dispatch(saving());

        const api = await gestorApi();
        const { data } = await api.delete(`tarjetas/forId/${id}`);
        dispatch(deleteTarjeta(data.deleteTarjeta))
    };

    const startUpdateTarjeta = async (args) => {
        dispatch(saving());

        let tarjeta = { ...args }

        tarjeta.importe = typeof tarjeta.importe === 'number' ? tarjeta.importe : parseFloat(tarjeta.importe)
        tarjeta.tarjeta = tarjeta.tarjeta._id ? tarjeta.tarjeta._id : tarjeta.tarjeta;

        try {
            const api = await gestorApi();
            const { data } = await api.patch(`tarjetas/forId/${tarjeta._id}`, tarjeta);

            dispatch(updateTarjeta(data.tarjeta));

        } catch (error) {
            console.log(error.response.data.error);
            Swal.fire('No se puedo modificar la contraseña', error.response.data.error[0].message, 'error');
        }

    };

    return {
        //Atributos
        isSavingTarjeta,
        tarjetas,
        tarjetaActive,

        //Metodos
        emptyActiveTarjeta,
        startSetActiveTarjeta,
        startDeleteTarjeta,
        startGetTarjetas,
        startPostTarjeta,
        startUpdateTarjeta
    }
}