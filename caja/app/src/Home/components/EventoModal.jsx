import React, { useEffect } from 'react'
import { useEventoStore, useForm } from '../../hooks'
import { useCategoriaEventoStore } from '../../hooks/UseCategoriaEventoStore';
import { useDispatch } from 'react-redux';
import { emptyEventoActive } from '../../store/evento/eventoSlice';
import { verificarDatosEvento } from '../../helpers/verificarDatos';
import { Spinner } from '../../components/Spinner';
import { isSaving } from '../../store/evento/eventoSlice';
import Swal from 'sweetalert2';

const EventoModal = ({ cerrar, mes }) => {
    const { eventoActive, isSavingEvento, startDeleteEvento, startPatchEvento, startPostEvento } = useEventoStore();
    const { categoriaEventos, getAllCategories } = useCategoriaEventoStore();
    const { onInputChange, title, description, start_date, end_date, all_day, category, formState } = useForm(eventoActive);
    const dispatch = useDispatch();

    useEffect(() => {
        getAllCategories()
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!await verificarDatosEvento(formState)) return;
        dispatch(isSaving());

        startPostEvento(formState, mes);
        cerrar(false);
    };

    const handlePutEvento = async () => {
        if (!await verificarDatosEvento(formState)) return;
        dispatch(isSaving());

        startPatchEvento(formState, mes);
        cerrar(false);
    };

    const handleDelete = async () => {

        const { isConfirmed } = await Swal.fire({
            title: `¿Seguro Quiere Eliminar el evento ${eventoActive.title}?`,
            confirmButtonText: 'Aceptar',
            showCancelButton: true
        });

        if (isConfirmed) {
            dispatch(isSaving());

            startDeleteEvento(eventoActive._id);
            cerrar(cerrar(true));
        };
    };

    const cerrarModal = () => {
        dispatch(emptyEventoActive())
        cerrar(false);
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/80 z-50'>
            <div className=' p-8 rounded-lg shadow-lg w-full max-w-md bg-white'>
                <h2 className='text-center text-2xl font-bold text-gray-800 mb-6'>{eventoActive._id ? 'Modificar Evento' : 'Agregar Evento'}</h2>

                <form onSubmit={handleSubmit}>
                    {/* Campo Titulo */}
                    <div className='mb-4'>
                        <label htmlFor="title" className='block text-sm font-medium text-gray-700'>Titulo*</label>
                        <input onChange={onInputChange} name='title' type="text" value={title || ''} id="fecha" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="description" className='block text-sm font-medium text-gray-700'>Descripcion</label>
                        <input onChange={onInputChange} name='description' type="text" value={description || ''} id="fecha" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="start_date" className='block text-sm font-medium text-gray-700'>Hora de Inicio</label>
                        <input onChange={onInputChange} name='start_date' type="datetime-local" value={start_date?.slice(0, 19) || ''} id="fecha" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="end_date" className='block text-sm font-medium text-gray-700'>Hora de Fin</label>
                        <input onChange={onInputChange} min={start_date?.slice(0, 19) || ''} name='end_date' type="datetime-local" value={end_date?.slice(0, 19) || ''} id="fecha" className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="category" className='block text-sm font-medium text-gray-700'>Categoria*</label>
                        <select name="category" id="category" value={category?._id ? category._id : category || ''} onChange={onInputChange} className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none fcous:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                            <option value=" ">---Seleccionar---</option>
                            {
                                categoriaEventos.map((elem) => (
                                    <option key={elem._id} value={elem._id}>
                                        {elem.nombre}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='mb-4 flex gap-5'>
                        <label htmlFor="all_day" className='block text-sm font-medium text-gray-700'>Todo el dia</label>
                        <input onChange={onInputChange} name='all_day' type="checkbox" value={all_day} id="all_day"
                            className='mt-1 block px-4 scale-150 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    </div>

                    {/* Botones */}
                    <div className='flex justify-end gap-4'>
                        {isSavingEvento && <Spinner />}
                        <button type='button' onClick={cerrarModal} disabled={isSavingEvento} className='text-black border-gray-400 border rounded-lg cursor-pointer px-4 py-2 hover:bg-gray-200 hover:text-gray-800 focus:outline-none'>Cancelar</button>
                        {!eventoActive._id && <button type='submit' disabled={isSavingEvento} className='text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Agregar</button>}
                        {eventoActive._id && <button type='button' disabled={isSavingEvento} onClick={handleDelete} className='text-white cursor-pointer px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Eliminar</button>}
                        {eventoActive._id && <button type='button' disabled={isSavingEvento} onClick={handlePutEvento} className='text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>Modificar</button>}


                    </div>
                </form>
            </div>
        </div>
    )
}

export default EventoModal