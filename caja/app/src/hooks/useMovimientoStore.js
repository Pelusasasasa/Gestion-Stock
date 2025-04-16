import { useDispatch, useSelector } from 'react-redux';
import gestorApi from '../api/gestionApi';
import { deleteMovimiento, patchMovimiento, postMovimiento, setMovimientos } from '../store/movimientos/movimientoSlice';

export const useMovimientoStore = () => {
    const dispatch = useDispatch();
    const { movimientos, movimientoActive, isSavingMovimiento } = useSelector(state => state.movimiento);

    const startDeleteOne = async (id) => {
        const api = await gestorApi();

        try {
            const { data } = await api.delete(`movCaja/${id}`);

            dispatch(deleteMovimiento(data.deleteMov._id));
        } catch (error) {
            console.log(error.response.data.msg);
        }
    }

    const startGetall = async (desde, hasta, tipo) => {

        const api = await gestorApi();

        try {
            const { data } = await api.get(`movCaja/forDate/${desde}/${hasta}/${tipo}`);
            dispatch(setMovimientos(data.movs));
        } catch (error) {
            console.log(error.response.data.msg);
        }

    };

    const startPostOne = async (mov) => {
        const api = await gestorApi();

        try {
            const { data } = await api.post('movCaja', mov);

            dispatch(postMovimiento(data.mov));
        } catch (error) {
            console.log(error.response.data.msg);

        }

    };

    const startPatchOne = async (mov) => {
        const api = await gestorApi();

        try {
            const { data } = api.patch(`movCaja/${mov._id}`, mov);
            dispatch(patchMovimiento(data.updateMov));
        } catch (error) {
            console.log(error.response.data.msg);
        }
    };


    return {
        //Atributos
        isSavingMovimiento,
        movimientoActive,
        movimientos,

        //Metodos
        startDeleteOne,
        startGetall,
        startPatchOne,
        startPostOne

    }

};