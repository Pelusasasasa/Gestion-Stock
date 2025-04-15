import React, { useEffect } from 'react'


import { useTiposTarjetasStore } from '../../hooks/UseTiposTarjetasStore'
import { useForm } from '../../hooks/Useform';
import { useDispatch } from 'react-redux';
import { savingTipoTarjeta } from '../../store/tipoTarjeta/tipoTarjetaSlice';
import { TipoTarjetaCard } from './TipoTarjetaCard';

const initialState = {
    nombre: ''
}

export const TipoTarjetas = () => {
    const dispatch = useDispatch();
    const { isSavingTipoTarjeta, startGetTiposTarjetas, startPostTiposTarjetas, tiposTarjetas } = useTiposTarjetasStore();
    const { onInputChange, nombre, formState, onResetForm } = useForm(initialState);

    useEffect(() => {
        startGetTiposTarjetas();
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(savingTipoTarjeta())

        startPostTiposTarjetas(formState);

        onResetForm();

    };


    return (

        <div>
            <h3 className='text-2xl px-5 pt-5 font-bold'>Configuracion de Tipos de Tarjetas</h3>

            <div className='bg-gray-50 mx-5 flex flex-col gap-5 px-5 pt-5'>
                <label htmlFor="nombre" className='text-xl'>Agregar Nuevo Tipo de Tarjeta</label>
                <form className='flex justify-around px-5 pb-5 gap-2' onSubmit={onSubmit}>
                    <input type="text" disabled={isSavingTipoTarjeta} name="nombre" onChange={onInputChange} value={nombre} id="nombre" className='flex-1 bg-white pl-2 border rounded-lg border-gray-300' />
                    <button type='submit' className='p-2 bg-black text-gray-200 hover:cursor-pointer rounded-md hover:opacity-80'>Agregar</button>
                </form>
            </div>

            <div className=' m-5 border border-gray-300 rounded-lg'>
                <table className=' w-full px-5 bg-gray-50'>
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='text-left px-2 py-5'>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tiposTarjetas?.map(elem => (
                            <TipoTarjetaCard key={elem._id} {...elem} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
