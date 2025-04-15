import React, { useEffect } from 'react'

import { useForm } from '../../hooks/Useform';
import { useDispatch } from 'react-redux';
import { savingCategoriaEvento } from '../../store/categoriaEvento/categoriaEventoSlice';
import { useCategoriaEventoStore } from '../../hooks/useCategoriaEventoStore';
import { CategoriaEventoCard } from './CategoriaEventoCard';


const initialState = {
    nombre: '',
    color: '#000000'
}

export const TipoEvento = () => {
    const dispatch = useDispatch();
    const { isSavingCategoriaEvento, getAllCategories, categoriaEventos, startPostCategory } = useCategoriaEventoStore();
    const { onInputChange, nombre, color, formState, onResetForm } = useForm(initialState);


    useEffect(() => {
        getAllCategories()
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(savingCategoriaEvento(formState));


        startPostCategory(formState);

        onResetForm();
    };


    return (

        <div>
            <h3 className='text-2xl px-5 pt-5 font-bold'>Configuracion de Categorias de Eventos</h3>

            <div className='bg-gray-50 mx-5 flex flex-col gap-5 px-5 pt-5'>
                <label htmlFor="nombre" className='text-xl'>Agregar Nueva Categoria de Evento para el calendario</label>
                <form className='flex justify-around px-5 pb-5 gap-2' onSubmit={onSubmit}>
                    <input type="text" name="nombre" onChange={onInputChange} value={nombre} id="nombre" className='flex-1 bg-white pl-2 border rounded-lg border-gray-300' />
                    <label htmlFor="color">Color: </label>
                    <input type="color" className='h-auto' id='color' name='color' value={color} onChange={onInputChange} />
                    <button type='submit' disabled={isSavingCategoriaEvento} className='p-2 bg-black text-gray-200 hover:cursor-pointer rounded-md hover:opacity-80'>Agregar</button>
                </form>
            </div>

            <div className=' m-5 border border-gray-300 rounded-lg'>
                <table className=' w-full px-5 bg-gray-50'>
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='text-left px-2 py-5'>Nombre</th>
                            <th className='text-left px-2 py-5'>Color</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoriaEventos?.map(elem => (
                            <CategoriaEventoCard key={elem._id} {...elem} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
