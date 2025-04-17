import { useDispatch, useSelector } from 'react-redux';
import gestorApi from '../api/gestionApi';
import { deleteMovimiento, patchMovimiento, postMovimiento, setMovimientoActive, setMovimientos } from '../store/movimientos/movimientoSlice';
import Swal from 'sweetalert2';

export const useMovimientoStore = () => {
    const dispatch = useDispatch();
    const { movimientos, movimientoActive, isSavingMovimiento } = useSelector(state => state.movimiento);

    const startActiveMovCaja = (_id) => {
        const movAux = movimientos.find(elem => elem._id === _id);

        const mov = {
            ...movAux,
            condicion: movAux.tipo.tipo
        }

        dispatch(setMovimientoActive(mov));
    }

    const startDeleteOneMov = async (id) => {
        const api = await gestorApi();

        try {
            const { data } = await api.delete(`movCaja/${id}`);
            dispatch(deleteMovimiento(data.deleteMovCaja._id));
        } catch (error) {
            console.log(error.response.data.msg);
        }
    };

    const startGetallMov = async (desde, hasta, tipo) => {

        const api = await gestorApi();

        try {
            const { data } = await api.get(`movCaja/forDate/${desde}/${hasta}/${tipo}`);
            dispatch(setMovimientos(data.movs));
        } catch (error) {
            console.log(error.response.data.msg);
        }

    };

    const startPostOneMov = async (mov) => {
        const api = await gestorApi();

        try {
            const { data } = await api.post('movCaja', mov);

            dispatch(postMovimiento(data.mov));
        } catch (error) {
            await Swal.fire('No se pudo cargar El movimiento', error.response.data.msg, 'error');
            console.log(error.response.data.error);
        };

    };

    const startPatchOneMov = async (movAux) => {
        const mov = {
            ...movAux,
        };

        mov.tipo = movAux.tipo._id ? movAux.tipo._id : movAux.tipo;

        const api = await gestorApi();
        
        try {
            const { data } = await api.patch(`movCaja/${mov._id}`, mov);
            
            dispatch(patchMovimiento(data.updateMovCaja));
        } catch (error) {
            console.log(error);
        }
    };


    return {
        //Atributos
        isSavingMovimiento,
        movimientoActive,
        movimientos,

        //Metodos
        startActiveMovCaja,
        startDeleteOneMov,
        startGetallMov,
        startPatchOneMov,
        startPostOneMov

    }

};