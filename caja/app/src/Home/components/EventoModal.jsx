import React from 'react'
import { useEventoStore, useForm } from '../../hooks'

const EventoModal = ({ cerrarModal }) => {
    const { onInputChange, title } = useForm();
    const { eventoActive } = useEventoStore()
    const handleSubmit = () => {

    };

    const handlePutEvento = () => {

    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/80 z-50'>
            <div className=' p-8 rounded-lg shadow-lg w-full max-w-md bg-white'>
                <h2 className='text-center text-2xl font-bold text-gray-800 mb-6'>{eventoActive._id ? 'Modificar Evento' : 'Agregar Evento'}</h2>

                <form onSubmit={handleSubmit}>
                    {/* Campo Titulo */}
                    <div className='mb-4'>
                        <label htmlFor="title" className='block text-sm font-medium text-gray-700'>Titulo</label>
                        <input onChange={onInputChange} name='title' type="text" value={title} id="fecha" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>
                    {/* Botones */}
                    <div className='flex justify-end gap-4'>
                        <button type='button' onClick={cerrarModal} className='text-white cursor-pointer px-4 py-2 hover:text-gray-800 focus:outline-none'>Cancelar</button>
                        {!eventoActive._id && <button type='submit' className='text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Agregar</button>}
                        {eventoActive._id && <button type='button' onClick={handlePutEvento} className='text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Modificar</button>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EventoModal