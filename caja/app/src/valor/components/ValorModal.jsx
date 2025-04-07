import React from 'react'
import { useValoresStore } from '../../hooks/useValoresStore'
import { useForm } from '../../hooks/Useform';

export const ValorModal = ({ cerrar }) => {

    const { valorActive } = useValoresStore();
    const { importe, nombre, vendedor, onInputChange, formState } = useForm();

    const handleSubmit = () => {

    };

    const handlePatchValor = () => {

    };

    const cerrarModal = () => {
        cerrar(false)
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/80 z-50'>
            <div className=' p-8 rounded-lg shadow-lg w-full max-w-md bg-white'>
                <h2 className='text-center text-2xl font-bold text-gray-800 mb-6'>{valorActive._id ? 'Modificar Tarjeta' : 'Agregar Tarjeta'}</h2>

                <form onSubmit={handleSubmit}>

                    {/* Campo Nombre */}
                    <div className='mb-4'>
                        <label htmlFor="nombre" className='block text-sm font-medium text-gray-700'>Nombre</label>
                        <input onChange={onInputChange} name='nombre' type="text" value={nombre?.slice(0, 10)} id="fecha" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="importe" className='block text-sm font-medium text-gray-700'>Importe</label>
                        <input onChange={onInputChange} name='importe' type="number" value={importe?.slice(0, 10)} id="fecha" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="vendedor" className='block text-sm font-medium text-gray-700'>Vendedor</label>
                        <input onChange={onInputChange} name='vendedor' type="text" value={vendedor?.slice(0, 10)} id="fecha" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    {/* Botones */}
                    <div className='flex justify-end gap-4'>
                        <button type='button' onClick={cerrarModal} className='text-black cursor-pointer px-4 py-2 hover:text-gray-800 focus:outline-none'>Cancelar</button>
                        {!valorActive._id && <button type='submit' className='text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Agregar</button>}
                        {valorActive._id && <button type='button' onClick={handlePatchValor} className='text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Modificar</button>}
                    </div>
                </form>
            </div>
        </div>
    )
}
