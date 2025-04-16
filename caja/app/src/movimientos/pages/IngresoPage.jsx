import React, { useEffect } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { IngresoCard } from '../components/IngresoCard';
import { useMovimientoStore } from '../../hooks/useMovimientoStore';

export const IngresoPage = ({ section, desde, hasta }) => {

    const { movimientos, startGetall } = useMovimientoStore();

    useEffect(() => {
        startGetall(desde, hasta, section === 'Ingreso' ? 'I' : 'E');
    }, [])

    return (
        <main className='py-2'>
            <div className='flex py-3 justify-between mx-5'>
                <h3 className='text-gray-700 text-xl '>Registro de {section}</h3>
                <button className='flex gap-2 bg-gray-700 text-white p-2 rounded-lg items-center cursor-pointer hover:opacity-80'>
                    <IoIosAdd size={20} />
                    Nuevo Ingreso / Egreso
                </button>
            </div>

            <div className='mx-5'>
                <table className='w-full'>
                    <thead className='border-b border-b-gray-400 bg-gray-100'>
                        <tr>
                            <th className='text-gray-600'>Fecha</th>
                            <th className='text-gray-600'>Descripcion</th>
                            <th className='text-gray-600'>Tipo</th>
                            <th className='text-gray-600'>Importe</th>
                            <th className='text-gray-600'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            movimientos.map(elem => (
                                <IngresoCard {...elem} key={elem._id} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </main>
    )
}
