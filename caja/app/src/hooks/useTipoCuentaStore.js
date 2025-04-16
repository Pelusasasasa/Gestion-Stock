import { useDispatch, useSelector } from 'react-redux';
import gestorApi from '../api/gestionApi';
import { deleteTipoCuenta, patchTipoCuenta, postTipoCuenta, setTipoCuentas } from '../store/tipoCuenta/tipoCuentaSlice';

export const useTipoCuentaStore = () => {

    const { tipoCuentas, isSavingTipoCuenta, tipoCuentaActive } = useSelector( state => state.tipoCuenta );
    const dispatch = useDispatch();

    const startDeleteTipoCuenta = async( id ) => {
        const api = await gestorApi()

        const { data } = await api.delete(`tipoCuenta/${id}`);

        dispatch( deleteTipoCuenta(data.deleteTipoCuenta._id) );
    };

    const startGetsTiposCuentas = async() => {
        const api = await gestorApi()

        const {data} = await api.get('tipoCuenta');
        console.log(data)
        dispatch( setTipoCuentas(data.tipoCuentas) );
    };

    const startPatchTipoCuenta = async( tipoCuenta ) => {
        const api = await gestorApi();

        const { data } = await api.patch(`tipoCuenta/${tipoCuenta._id}`, tipoCuenta);

        dispatch( patchTipoCuenta(data.updateTipoCuenta) );
    };

    const startPostTipoCuenta = async( tipoCuenta ) => {
        const api = await gestorApi()

        const { data } = await api.post('tipoCuenta', tipoCuenta);

        dispatch( postTipoCuenta(data.tipo) );
        
    };

    return {
        //Atributos
        isSavingTipoCuenta,
        tipoCuentaActive,
        tipoCuentas,

        //Metodos
        startDeleteTipoCuenta,
        startGetsTiposCuentas,
        startPatchTipoCuenta,
        startPostTipoCuenta

    }

};