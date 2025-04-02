import React, { useEffect, useState } from 'react'
import { useForm } from '../../hooks'
import { Link } from 'react-router-dom';

import { TarjetaCard } from '../components/TarjetaCard';
import { TarjetaModal } from '../components/TarjetaModal';
import { useTarjetaStore } from '../../hooks/useTarjetaStore';


let initialState = {
    buscador: ''
}

export const Tarjetas = () => {
    const { startGetTarjetas, tarjetas } = useTarjetaStore();
    const { onInputChange, buscador } = useForm(initialState);

    const [modal, setModal] = useState(false);
    const [tarjetasFiltradas, setTarjetasFiltradas] = useState(tarjetas)

    const handleModal = () => {
        setModal(true)
    };

    useEffect(() => {
        startGetTarjetas()
    }, []);

    useEffect(() => {
        setTarjetasFiltradas(tarjetas);
    }, [tarjetas])

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
                            <th className='border'>Importe</th>
                            <th className='border'>Tipo</th>
                            <th className='border'>Vendedor</th>
                            <th className='border'>Acciones</th>

                        </tr>
                    </thead>
                    <tbody>
                        {tarjetasFiltradas.map(elem => (
                            <TarjetaCard {...elem} key={elem._id} modal={setModal} />
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Botones */}
            <section className='mt-5 flex justify-around'>
                <button className='bg-green-400' onClick={handleModal}>Agregar</button>
                <Link to='/' >
                    <button type='button' className='text-black' onClick={salir}>
                        Salir
                    </button>
                </Link>
            </section>

            {modal && <TarjetaModal cerrar={setModal} />}
        </div>
    )
}
