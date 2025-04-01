import React, { useEffect } from 'react'
import { useForm } from '../../hooks'
import { TarjetaCard } from '../components/TarjetaCard';
import { Link } from 'react-router-dom';
import { useTiposTarjetasStore } from '../../hooks/UseTiposTarjetasStore';

let tarjetasFiltradas = [];

let initialState = {
    buscador: ''
}

export const Tarjetas = () => {
    const { startGetTiposTarjetas } = useTiposTarjetasStore();
    const { onInputChange, buscador } = useForm(initialState);

    useEffect(() => {
        startGetTiposTarjetas()
    }, [])

    const salir = () => {
    }


    return (
        <div className=' bg-amber-700 w-screen h-screen'>

            {/* Buscador */}
            <section className='flex gap-2 justify-around items-center'>
                <div className='flex p-2 flex-col gap-2 w-xl'>
                    <label htmlFor="buscador" className='text-white text-2xl text-center'>Buscador</label>
                    <input className='bg-white border p-2' type="text" value={buscador} onChange={onInputChange} placeholder='Buscador...' name="buscador" id="buscador" />
                </div>
            </section>

            {/* Listado de Cheques */}
            <section className='bg-white h-96 overflow-scroll'>
                <table className='w-full'>
                    <thead>
                        <tr>
                            <th className='border'>Fecha</th>
                            <th className='border'>Nombre</th>
                            <th className='border'>Tarjeta</th>
                            <th className='border'>Tipo</th>
                            <th className='border'>Vendedor</th>

                        </tr>
                    </thead>
                    <tbody>
                        {tarjetasFiltradas.map(elem => (
                            <TarjetaCard {...elem} key={elem._id} />
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Botones */}
            <section className='mt-5 flex justify-around'>
                <button className='bg-green-400'>Agregar</button>
                <Link to='/' >
                    <button type='button' className='text-black' onClick={salir}>
                        Salir
                    </button>
                </Link>
            </section>
        </div>
    )
}
