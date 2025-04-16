import React, { useEffect } from 'react'
import { useForm } from '../../hooks/Useform';
import { useTipoCuentaStore } from '../../hooks/useTipoCuentaStore';
import { savingTipoCuenta } from '../../store/tipoCuenta/tipoCuentaSlice';
import { useDispatch } from 'react-redux';
import { TipocuentaCard } from '../components/tipocuentaCard';


const initialState = {
    nombre: '',
    tipo: 'E'
}

export const TipoCuenta = () => {
    const dispatch = useDispatch();
    const { startGetsTiposCuentas, startPostTipoCuenta, tipoCuentas } = useTipoCuentaStore()
    const { onInputChange, nombre, tipo, formState, onResetForm } = useForm(initialState);


    useEffect(() => {
        startGetsTiposCuentas()
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(savingTipoCuenta());
        startPostTipoCuenta(formState);

        onResetForm();
    };


    return (

        <div>
            <h3 className='text-2xl px-5 pt-5 font-bold'>Configuracion de Tipo de Cuentas</h3>

            <div className='bg-gray-50 mx-5 flex flex-col gap-5 px-5 pt-5'>
                <label htmlFor="nombre" className='text-xl'>Agregar Nueva Tipo de Cuenta para los Ingresos/Egresos</label>
                <form className='flex justify-around px-5 pb-5 gap-2' onSubmit={onSubmit}>
                    <input type="text" name="nombre" onChange={onInputChange} value={nombre} id="nombre" className='flex-1 bg-white pl-2 border rounded-lg border-gray-300' />
                    <select name="tipo" id="tipo" value={tipo} onChange={onInputChange} className='flex-1 bg-white pl-2 border rounded-lg border-gray-300'>
                        <option value="E">Egreso</option>
                        <option value="I">Ingreso</option>
                    </select>
                    <button type='submit' className='p-2 bg-black text-gray-200 hover:cursor-pointer rounded-md hover:opacity-80'>Agregar</button>
                </form>
            </div>

            <div className=' m-5 border border-gray-300 rounded-lg'>
                <table className=' w-full px-5 bg-gray-50'>
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='text-left px-2 py-5'>Nombre</th>
                            <th className='text-left px-2 py-5'>Tipo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tipoCuentas.map(elem => (
                            <TipocuentaCard key={elem._id} {...elem} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
