import { useDispatch, useSelector } from 'react-redux';
import gestorApi from '../api/gestionApi';
import { deleteTipoCuenta, patchTipoCuenta, postTipoCuenta, setTipoCuentas } from '../store/tipoCuenta/tipoCuentaSlice';
import Swal from 'sweetalert2';

export const useTipoCuentaStore = () => {

    const { tipoCuentas, isSavingTipoCuenta, tipoCuentaActive } = useSelector(state => state.tipoCuenta);
    const dispatch = useDispatch();

    const startDeleteTipoCuenta = async (id) => {
        const api = await gestorApi()

        const { data } = await api.delete(`tipoCuenta/${id}`);

        dispatch(deleteTipoCuenta(data.tipoCuentaDelete._id));
    };

    const startGetsTiposCuentas = async () => {
        const api = await gestorApi()

        const { data } = await api.get('tipoCuenta');
        dispatch(setTipoCuentas(data.tipoCuentas));
    };

    const startGetsTiposCuentasFilter = async (tipo = 'A') => {
        const api = await gestorApi();

        const { data } = await api.get(`tipoCuenta/type/${tipo}`);

        dispatch(setTipoCuentas(data.tipoCuentas))
    }

    const startPatchTipoCuenta = async (tipoCuenta) => {
        const api = await gestorApi();
        try {
            const { data } = await api.patch(`tipoCuenta/${tipoCuenta._id}`, tipoCuenta);
            dispatch(patchTipoCuenta(data.updateTipoCuenta));
        } catch (error) {
            console.log(error);
            await Swal.fire('Error al modificar tipo cuenta', `${error.response.data.msg}`, 'error');
        }
    };

    const startPostTipoCuenta = async (tipoCuenta) => {
        const api = await gestorApi()

        const { data } = await api.post('tipoCuenta', tipoCuenta);

        dispatch(postTipoCuenta(data.tipoCuenta));

    };

    return {
        //Atributos
        isSavingTipoCuenta,
        tipoCuentaActive,
        tipoCuentas,

        //Metodos
        startDeleteTipoCuenta,
        startGetsTiposCuentas,
        startGetsTiposCuentasFilter,
        startPatchTipoCuenta,
        startPostTipoCuenta

    }

};