import React, { useEffect, useState } from 'react'
import { useForm } from '../../hooks'

import { TarjetaCard } from '../components/TarjetaCard';
import { TarjetaModal } from '../components/TarjetaModal';
import { useTarjetaStore } from '../../hooks';
import { IoIosAdd } from 'react-icons/io';


let initialState = {
    buscador: ''
}

export const Tarjetas = () => {
    const { startGetTarjetas, tarjetas } = useTarjetaStore();
    const { onInputChange, buscador, formState } = useForm(initialState);

    const [modal, setModal] = useState(false);
    const [tarjetasFiltradas, setTarjetasFiltradas] = useState(tarjetas);

    const handleModal = () => {
        setModal(true)
    };

    useEffect(() => {
        startGetTarjetas()
    }, []);

    useEffect(() => {
        setTarjetasFiltradas(tarjetas);
    }, [tarjetas]);

    useEffect(() => {
        setTarjetasFiltradas(tarjetas.filter(elem => elem?.tarjeta?.nombre.startsWith(buscador.toUpperCase())));
    }, [formState])

    return (
        <section className='  w-[calc(100vw-5rem)] h-screen'>
            <h3 className='text-3xl font-bold p-5'>Gestion De Tajetas</h3>

            <div className='bg-gray-100 h-[calc(100vh-5rem)] flex-col flex'>

                {/* Buscador y Agregar nuevo */}
                <div className='bg-white mt-5 pt-5 mx-5 rounded-t-xl'>
                    <form action="" className='flex justify-around'>
                        <div className='flex flex-col gap-2 w-80'>
                            <label htmlFor="buscador">Buscador</label>
                            <input type="text" name="buscador" id="buscador" className='border p-1 border-gray-400 rounded-sm' onChange={onInputChange} value={buscador} />
                        </div>


                        <button type='button' className='self-end flex gap-2 rounded-lg p-2 bg-black items-center hover:opacity-80 text-white' onClick={handleModal}>
                            <IoIosAdd size={20} />
                            Nuevo Tarjeta
                        </button>

                    </form>
                </div>

                {/* Listado */}
                <div className='gap-2 flex flex-col py-5 mb-5 mx-5 bg-white rounded-b-xl'>
                    {
                        tarjetasFiltradas.map(elem => (
                            <TarjetaCard {...elem} key={elem._id} modal={handleModal} />
                        ))
                    }
                </div>
            </div>

            {modal && <TarjetaModal cerrar={setModal} />}

        </section>

    )
}
